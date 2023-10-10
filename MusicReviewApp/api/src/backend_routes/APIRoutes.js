const express = require('express');
const cookieParser = require('cookie-parser');
const apiRouter = express.Router();

apiRouter.use(express.json());
apiRouter.use(cookieParser());

const URL_USER_START = "/users/current";
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
let spotifyToken = "";
const UserDAO = require('../db/UserDAO');
const ReviewDAO = require('../db/ReviewDAO');
const PlaylistDAO = require('../db/PlaylistDAO');
const {TokenMiddleware, generateToken, removeToken} = require('../middleware/TokenMiddleware');


/************\
* USER ROUTES *
\************/

// create new user and return user object and log in user
apiRouter.post('/register', (req, res) => {
  let user = req.body;
  let username = user.username;
  let password = user.password;
  let first_name = user.first_name;
  let last_name = user.last_name;
  if(username && password && first_name && last_name) {
    UserDAO.createUser(username, password, first_name, last_name).then(user => {
      let result = {
        user: user
      }

      // create musify token
      generateToken(req, res, user);

      //get spotify token
      fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
      })
      .then(response => response.json())
      .then(data => spotifyToken = data["access_token"])
      .catch(error => console.error(error));

      res.json(result);
    }).catch(err => {
      res.status(400).json({error: err});
    });
  }
  else {
    res.status(400).json({error: 'Not correct format'});
  }
});

// recieves input for user login
apiRouter.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(username && password) {
    UserDAO.getUserByCredentials(username, password).then(user => {
      let result = {
        user: user
      }

      //create token for musify session
      generateToken(req, res, user);

  
      //get spotify token
      fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
      })
      .then(response => response.json())
      .then(data => spotifyToken = data["access_token"])
      .catch(error => console.error(error));

      res.json(result);
    }).catch(err => {
      res.status(400).json({error: err});
    });
  }
  else {
    res.status(400).json({error: 'Not correct format'});
  }
});

//logs out current user
apiRouter.post('/logout', (req, res) => {
  removeToken(req, res);

  res.json({success: true});
});


// get all users
apiRouter.get('/users', TokenMiddleware, (req, res) => {
  UserDAO.getUsers().then(users => {
    res.json(users);
  })
  .catch(err => {
    res.status(400).json({error: err});
  });
});

// gets current user
apiRouter.get(URL_USER_START, TokenMiddleware, (req, res) => {
  const userId = req.user.id;
 
  UserDAO.getUser(userId).then(user => {
    res.json(user);
  })
  .catch(err => {
    res.status(400).json({error: err});
  });
});


/**************\
* REVIEW ROUTES *
\**************/

// get all reviews from user
apiRouter.get(URL_USER_START + '/reviews', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  ReviewDAO.getUserReviews(userId).then(reviews => {
    res.json(reviews);
  })
  .catch(err => {
    res.status(400).json({error: err});
  });
});

// get all sorted reviews from user
apiRouter.get(URL_USER_START + '/sortedReviews', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  ReviewDAO.getUserReviews(userId).then(reviews => {
    if(reviews) {
      let sortedList = reviews.sort((a, b) => {
        let dateA = new Date(a.time);
        let dateB = new Date(b.time);
      
        // Compare the dates in descending order
        if (dateA > dateB) {
          return -1;
        }
        if (dateA < dateB) {
          return 1;
        }
        return 0;
      });
      
      
      let fetchPromises = [];

      sortedList.forEach(review => {
        let fetchPromise;
      
        if(review.type === "album") {
          fetchPromise = fetch('https://api.spotify.com/v1/albums/' + review.mbid, {
            headers: {
              'Authorization': 'Bearer ' + spotifyToken
            }
          })
          .then(response => response.json())
          .then(data => {
            review.images = data.images;
            review.artistName = data.artists[0].name;
            review.albumName = data.name;
          })
          .catch(error => console.error(error));
        } else if(review.type === "song") {
          fetchPromise = fetch('https://api.spotify.com/v1/tracks/' + review.mbid, {
            headers: {
              'Authorization': 'Bearer ' + spotifyToken
            }
          })
          .then(response => response.json())
          .then(data => {
            review.images = data.album.images;
            review.artistName = data.artists[0].name;
            review.trackName = data.name;
            review.albumName = data.album.name;
          })
          .catch(error => console.error(error));
        } else if(review.type === "artist") {
          fetchPromise = fetch('https://api.spotify.com/v1/artists/' + review.mbid, {
            headers: {
              'Authorization': 'Bearer ' + spotifyToken
            }
          })
          .then(response => response.json())
          .then(data => {
            review.artistName = data.name;
            review.images = data.images;
          })
          .catch(error => console.error(error));
        }
      
        if(fetchPromise) {
          fetchPromises.push(fetchPromise);
        }
      });
      
      Promise.all(fetchPromises)
      .then(() => {
        res.json(sortedList);
      })
      .catch(error => console.error(error));      
    } else {
      res.status(404).json({error: 'Reviews not found'});
    }
  })
  .catch(err => {
    res.status(400).json({error: err});
  });
});

// get all artist reviews from user
apiRouter.get(URL_USER_START + '/reviews/artists', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  ReviewDAO.getUserReviewsByType(userId, "artist").then(reviews => {
    res.json(reviews);
  })
  .catch(err => {
    res.status(400).json({error: err});
  });
});

//get sorted reviews for artists
apiRouter.get(URL_USER_START + '/reviews/sortedArtists', TokenMiddleware, (req, res) => {
  console.log("HERE");
  const userId = req.user.id;
  ReviewDAO.getUserReviewsByType(userId, "artist").then(reviews => {
    if(reviews) {
      let sortedList = reviews.sort((a, b) => b.score - a.score);
      let fetchPromises = sortedList.map(review => 
        
        fetch('https://api.spotify.com/v1/' + 'artist' + 's/' + review.mbid, {
          headers: {
            'Authorization': 'Bearer ' + spotifyToken
          }
          })
          .then(response => response.json())
          .then(data => review.artistName = data.name)
          .catch(error => console.error(error))
      );
      Promise.all(fetchPromises).then(() => {
        res.json(sortedList);
      });
    }
    else {
      res.status(404).json({error: 'Reviews not found'});
    }
  })
  .catch(err => {
    res.status(400).json({error: err});
  });
});

// get all album reviews from user
apiRouter.get(URL_USER_START + '/reviews/albums', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  ReviewDAO.getUserReviewsByType(userId, "album").then(reviews => {
    let fetchPromises = reviews.map(review => 
        
      fetch('https://api.spotify.com/v1/' + 'album' + 's/' + review.mbid, {
        headers: {
          'Authorization': 'Bearer ' + spotifyToken
        }
        })
        .then(response => response.json())
        .then(data => {
          review.images = data.images;
          review.artistName = data.artists[0].name;
          review.albumName = data.name;
        })
        .catch(error => console.error(error))
    );
    Promise.all(fetchPromises).then(() => {
      res.json(reviews);
    });
  })
  .catch(err => {
    res.status(400).json({error: err});
  });
});

//get top albums for an artist
apiRouter.get(URL_USER_START + '/reviews/albums/artist/:artist', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  const artist = req.params.artist;
  ReviewDAO.getUserReviewsByType(userId, "album").then(reviews => {
    let finalList = [];
    let fetchPromises = reviews.map(review => 
        
      fetch('https://api.spotify.com/v1/' + 'album' + 's/' + review.mbid, {
        headers: {
          'Authorization': 'Bearer ' + spotifyToken
        }
        })
        .then(response => response.json())
        .then(data => {
          review.images = data.images;
          review.artistName = data.artists[0].name;
          review.albumName = data.name;
          if(data.artists[0].id === artist) {
            finalList.push(review);
          }
        })
        .catch(error => console.error(error))
    );
    Promise.all(fetchPromises).then(() => {
      let sortedList = finalList.sort((a, b) => b.score - a.score);
      res.json(sortedList);
    });
  })
  .catch(err => {
    res.status(400).json({error: err});
  });
});

//get top songs for an artist

apiRouter.get(URL_USER_START + '/reviews/songs/artist/:artist', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  const artist = req.params.artist;
  ReviewDAO.getUserReviewsByType(userId, "song").then(reviews => {
    let finalList = [];
    let fetchPromises = reviews.map(review => 
        
      fetch('https://api.spotify.com/v1/' + 'track' + 's/' + review.mbid, {
        headers: {
          'Authorization': 'Bearer ' + spotifyToken
        }
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          review.images = data.album.images;
          review.artistName = data.artists[0].name;
          review.trackName = data.name;
          review.albumName = data.album.name;
          if(data.artists[0].id === artist) {
            finalList.push(review);
          }
        })
        .catch(error => console.error(error))
    );
    Promise.all(fetchPromises).then(() => {
      let sortedList = finalList.sort((a, b) => b.score - a.score);
      res.json(sortedList);
    });
  })
  .catch(err => {
    res.status(400).json({error: err});
  });
});

//get sorted reviews for albums
apiRouter.get(URL_USER_START + '/reviews/sortedAlbums', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  ReviewDAO.getUserReviewsByType(userId, "album").then(reviews => {
    if(reviews) {
      let sortedList = reviews.sort((a, b) => b.score - a.score);
      let fetchPromises = sortedList.map(review => 
        
        fetch('https://api.spotify.com/v1/' + 'album' + 's/' + review.mbid, {
          headers: {
            'Authorization': 'Bearer ' + spotifyToken
          }
          })
          .then(response => response.json())
          .then(data => {
            review.images = data.images;
          review.artistName = data.artists[0].name;
          review.albumName = data.name;
          })
          .catch(error => console.error(error))
      );
      Promise.all(fetchPromises).then(() => {
        res.json(sortedList);
      });
    }
    else {
      res.status(404).json({error: 'Reviews not found'});
    }
  })
  .catch(err => {
    res.status(400).json({error: err});
  });
});

// get all song reviews from user
apiRouter.get(URL_USER_START + '/reviews/songs', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  ReviewDAO.getUserReviewsByType(userId, "song").then(reviews => {
    let fetchPromises = reviews.map(review => 
        
      fetch('https://api.spotify.com/v1/' + 'track' + 's/' + review.mbid, {
        headers: {
          'Authorization': 'Bearer ' + spotifyToken
        }
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          review.images = data.album.images;
          review.artistName = data.artists[0].name;
          review.trackName = data.name;
          review.albumName = data.album.name
        })
        .catch(error => console.error(error))
    );
    Promise.all(fetchPromises).then(() => {
      res.json(reviews);
    });
  })
  .catch(err => {
    res.status(400).json({error: err});
  });
});

//get sorted reviews for songs
apiRouter.get(URL_USER_START + '/reviews/sortedSongs', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  ReviewDAO.getUserReviewsByType(userId, "song").then(reviews => {
    if(reviews) {
      let sortedList = reviews.sort((a, b) => b.score - a.score);
      let fetchPromises = sortedList.map(review => 
        
        fetch('https://api.spotify.com/v1/' + 'track' + 's/' + review.mbid, {
          headers: {
            'Authorization': 'Bearer ' + spotifyToken
          }
          })
          .then(response => response.json())
          .then(data => {
            review.images = data.album.images;
          review.artistName = data.artists[0].name;
          review.trackName = data.name;
          review.albumName = data.album.name
          })
          .catch(error => console.error(error))
      );
      Promise.all(fetchPromises).then(() => {
        res.json(sortedList);
      });
    }
    else {
      res.status(404).json({error: 'Reviews not found'});
    }
  })
  .catch(err => {
    res.status(400).json({error: err});
  });
});

// get review by REVIEW ID
apiRouter.get(URL_USER_START + '/reviews/:reviewId', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  const reviewId = req.params.reviewId;
  ReviewDAO.getUserReviewById(userId, reviewId).then(review => {
    res.json(review);
  })
  .catch(err => {
    res.status(400).json({error: err});
  });
});

// get review by MBID
apiRouter.get(URL_USER_START + '/reviews/mbid/:mbid', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  const mbid = req.params.mbid;
  ReviewDAO.getUserReviewByMbid(userId, mbid).then(review => {
    res.json(review);
  })
  .catch(err => {
    res.status(400).json({error: err});
  });
});

// create review
apiRouter.post(URL_USER_START + '/reviews', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  let review = req.body;
  if(review) {
    ReviewDAO.createUserReview(userId, review).then(review => {
      let result = {
        review: review
      }

      res.json(result);
    }).catch(err => {
      res.status(400).json({error: err});
    });
  }
  else {
    res.status(400).json({error: 'Not correct format'});
  }
});

// update review
apiRouter.put(URL_USER_START + '/reviews/:reviewId', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  let newReview = req.body;
  const reviewId = req.params.reviewId;
  
  if(newReview) {
    ReviewDAO.updateUserReview(userId, newReview, reviewId).then(review => {
      let result = {
        review: review
      }

      res.json(result);
    }).catch(err => {
      res.status(400).json({error: err});
    });
  }
  else {
    res.status(400).json({error: 'Not correct format'});
  }
});


/*****************\
* GET INFO ROUTE *
\*****************/

// get song, album, or artist by mbid
// type can be track, album, or artist
apiRouter.get('/mbid/:mbid', (req, res) => {
  const type = req.query.type;
  const mbid = req.params.mbid;
  
  fetch('https://api.spotify.com/v1/' + type + 's/' + mbid, {
  headers: {
    'Authorization': 'Bearer ' + spotifyToken
  }
  })
  .then(response => response.json())
  .then(data => res.send(data))
  .catch(error => console.error(error));
  });

/****************\
* PLAYLIST ROUTES *
\****************/

// get all playlists from user
apiRouter.get(URL_USER_START + '/playlists', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  PlaylistDAO.getUserPlaylists(userId).then(playlists => {
    res.json(playlists);
  })
  .catch(err => {
    res.status(400).json({error: err});
  });
});

// get user playlist by PLAYLIST id
apiRouter.get(URL_USER_START + '/playlists/:playlistId', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  const playlistId = req.params.playlistId;
  PlaylistDAO.getUserPlaylistById(userId, playlistId).then(playlist => {
    res.json(playlist);
  })
  .catch(err => {
    res.status(400).json({error: err});
  });
});

// get all songs in playlist
apiRouter.get(URL_USER_START + '/playlists/:playlistId/songs', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  const playlistId = req.params.playlistId;
  PlaylistDAO.getUserPlaylistSongs(userId, playlistId).then(songs => {
    let fetchPromises = songs.map(song => 
        
      fetch('https://api.spotify.com/v1/' + 'track' + 's/' + song.mbid, {
        headers: {
          'Authorization': 'Bearer ' + spotifyToken
        }
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          song.images = data.album.images;
          song.artistName = data.artists[0].name;
          song.trackName = data.name;
          song.albumName = data.album.name
        })
        .catch(error => console.error(error))
    );
    Promise.all(fetchPromises).then(() => {
      res.json(songs);
    });
  })
  .catch(err => {
    res.status(400).json({error: err});
  });
});

// create playlist with name
apiRouter.post(URL_USER_START + '/playlists', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  let playlist = req.body;
  if(playlist) {
    PlaylistDAO.createUserPlaylist(userId, playlist).then(playlist => {
      let result = {
        playlist: playlist
      }

      res.json(result);
    }).catch(err => {
      res.status(400).json({error: err});
    });
  }
  else {
    res.status(400).json({error: 'Not correct format'});
  }
});

// add song to playlist
apiRouter.post(URL_USER_START + '/playlists/:playlistId/songs', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  const playlistId = req.params.playlistId;
  let songId = req.body.songid;
  if(songId) {
    PlaylistDAO.addSongToPlaylist(userId, playlistId, songId).then(playlist => {
      let result = {
        playlist: playlist
      }

      res.json(result);
    }).catch(err => {
      res.status(400).json({error: err});
    });
  }
  else {
    res.status(400).json({error: 'Not correct format'});
  }
});

// update playlist name
apiRouter.put(URL_USER_START + '/playlists/:playlistId', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  let newPlaylist = req.body;
  const playlistId = req.params.playlistId;
  
  if(newPlaylist) {
    PlaylistDAO.updateUserPlaylist(userId, newPlaylist, playlistId).then(playlist => {
      let result = {
        playlist: playlist
      }

      res.json(result);
    }).catch(err => {
      res.status(400).json({error: err});
    });
  }
  else {
    res.status(400).json({error: 'Not correct format'});
  }
});

// delete song from playlist
apiRouter.delete(URL_USER_START + '/playlists/:playlistId/songs/:songId', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  const playlistId = req.params.playlistId;
  const songId = req.params.songId;
  console.log(userId, playlistId, songId);
  PlaylistDAO.deleteSongFromPlaylist(userId, playlistId, songId).then(playlist => {
    res.json(playlist);
  })
  .catch(err => {
    res.status(400).json({error: err});
  });
});

// delete playlist
apiRouter.delete(URL_USER_START + '/playlists/:playlistId', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  const playlistId = req.params.playlistId;
  PlaylistDAO.deleteUserPlaylist(userId, playlistId).then(playlist => {
    res.json(playlist);
  })
  .catch(err => {
    res.status(400).json({error: err});
  });
});

// delete all songs from playlist
apiRouter.delete(URL_USER_START + '/playlists/:playlistId/songs', TokenMiddleware, (req, res) => {
  const userId = req.user.id;
  const playlistId = req.params.playlistId;
  PlaylistDAO.deleteAllSongsFromPlaylist(userId, playlistId).then(playlist => {
    res.json(playlist);
  })
  .catch(err => {
    res.status(400).json({error: err});
  });
});

/************\
* SEARCH ROUTE *
\************/

// search
// type can be track, album, or artist
apiRouter.get('/search', (req, res) => {
  const type = req.query.type;
  const query = req.query.query;
  
  fetch('https://api.spotify.com/v1/search?type=' + type + '&q=' + query, {
  headers: {
    'Authorization': 'Bearer ' + spotifyToken
  }
  })
  .then(response => response.json())
  .then(data => res.send(data))
  .catch(error => console.error(error));

});


/*******************\
* TOP CHARTS ROUTES *
\*******************/


// get top tracks right now via top 50 playlist
apiRouter.get('/charts/songs', (req, res) => {
  fetch('https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks?fields=items(added_by.id,track(id,name,href,album(name,href, images)))', {
  headers: {
    'Authorization': 'Bearer ' + spotifyToken
  }
  })
  .then(response => response.json())
  .then(data => res.send(data))
  .catch(error => console.error(error));
});

/**********************\
* RECOMMENDATION ROUTE *
\**********************/

// get music recommendation for user
apiRouter.get(URL_USER_START + '/recommendations', TokenMiddleware, (req, res) => {
  res.status(501).json({error: 'Not implemented'});
});

/**********************\
* SPECIAL OFFLINE ROUTE *
\**********************/

// return special value for offline
apiRouter.get('/offline', (req, res) => {
  let message = {
    special_value: 'offline'
  }
  res.json(message);
});

module.exports = apiRouter;
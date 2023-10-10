import HTTPClient from "./HTTPClient.js";

const API_BASE = '/api';
const URL_USER_START = '/users/current';

export default {

  logIn: (username, password) => {
    let data = {
      username: username,
      password: password
    }
    return HTTPClient.post(API_BASE+'/login', data)
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
        return;
      }
      return response;
    });
  },

  logout: () => {
    return HTTPClient.post(API_BASE+'/logout')
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
        return;
      }
      return response;
    });
  },

  register: (username, password, fname, lname) => {
    let data = {
      username: username,
      password: password,
      first_name: fname,
      last_name: lname
    }
    return HTTPClient.post(API_BASE+'/register', data);
  },

  getCurrentUser: () => {
    return HTTPClient.get(API_BASE+URL_USER_START)
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
      }
      return response;
    });
  },

  getArtistSortedReviews: () => {
    return HTTPClient.get(API_BASE+URL_USER_START+'/reviews/sortedArtists')
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
      }
      return response;
    });
  },

  // playlists
  getPlaylists: () => {
    return HTTPClient.get(API_BASE+URL_USER_START+'/playlists')
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
      }
      return response;
    });
  },

  getPlaylistById: (playlistId) => {
    return HTTPClient.get(API_BASE+URL_USER_START+`/playlists/${playlistId}`)
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
      }
      return response;
    });
  },

  // get all songs in a playlist
  getPlaylistSongs: (playlistId) => {
    return HTTPClient.get(API_BASE+URL_USER_START+`/playlists/${playlistId}/songs`)
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
      }
      return response;
    });
  },

  createPlaylist: (playlistName) => {
    return HTTPClient.post(API_BASE+URL_USER_START+'/playlists', {name: playlistName})
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
        return;
      }
      return response;
    });
  },

  addSongToPlaylist: (playlistId, songId) => {
    return HTTPClient.post(API_BASE+URL_USER_START+`/playlists/${playlistId}/songs`, {songid: songId})
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
        return;
      }
      return response;
    });
  },

  updatePlaylist: (playlistId, playlistName) => {
    return HTTPClient.put(API_BASE+URL_USER_START+`/playlists/${playlistId}`, {name: playlistName})
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
        return;
      }
      return response;
    });
  },

  deleteSongFromPlaylist: (playlistId, songId) => {
    return HTTPClient.delete(API_BASE+URL_USER_START+`/playlists/${playlistId}/songs/${songId}`)
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
        return;
      }
      return response;
    });
  },

  deletePlaylist: (playlistId) => {
    return HTTPClient.delete(API_BASE+URL_USER_START+`/playlists/${playlistId}`)
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
        return;
      }
      return response;
    });
  },

  deleteAllSongsFromPlaylist: (playlistId) => {
    return HTTPClient.delete(API_BASE+URL_USER_START+`/playlists/${playlistId}/songs`)
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
        return;
      }
      return response;
    });
  },

  getAlbumReviews: () => {
    return HTTPClient.get(API_BASE+URL_USER_START+'/reviews/albums')
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
      }
      return response;
    });
  },
  getSongReviews: () => {
    return HTTPClient.get(API_BASE+URL_USER_START+'/reviews/songs')
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
      }
      return response;
    });
  },
  getSearch: (type, query) => {
    return HTTPClient.get(API_BASE+`/search?type=${type}&query=${query}`)
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
      }
      return response;
    });
  },
  getByMbid: (type, mbid) => {
    return HTTPClient.get(API_BASE + `/mbid/${mbid}?type=${type}`)
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
      }
      return response;
    });
  },
  
  createReview: (review) => {
    return HTTPClient.post(API_BASE + URL_USER_START + '/reviews', review)
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
        return;
      }
      return response;
    });
  },
  getUserReviewByMbid: (mbid) => {
    return HTTPClient.get(API_BASE + URL_USER_START + `/reviews/mbid/${mbid}`)
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
      }
      return response;
    });
  },
  updateReview: (review, id) => {
    return HTTPClient.put(API_BASE + URL_USER_START + `/reviews/${id}`, review)
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
        return;
      }
      return response;
    });
  },
  getHotSongs: () => {
    return HTTPClient.get(API_BASE + '/charts/songs')
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
      }
      return response;
    });
  },
  getFavoriteSongs: () => {
    return HTTPClient.get(API_BASE + URL_USER_START + '/reviews/sortedSongs')
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
      }
      return response;
    });
  },
  getFavoriteAlbums: () => {
    return HTTPClient.get(API_BASE + URL_USER_START + '/reviews/sortedAlbums')
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
      }
      return response;
    });
  },
  getRecentlyReviewed: () => {
    return HTTPClient.get(API_BASE + URL_USER_START + '/sortedReviews')
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
      }
      return response;
    });
  },
  getTopAlbumsByArtist: (id) => {
    return HTTPClient.get(API_BASE + URL_USER_START + `/reviews/albums/artist/${id}`)
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
      }
      return response;
    });
  },
  getTopSongsByArtist: (id) => {
    return HTTPClient.get(API_BASE +URL_USER_START + `/reviews/songs/artist/${id}`)
    .then(response => {
      if (response.hasOwnProperty('special_value')) {
        window.location.href = "/offline";
      }
      return response;
    });
  }

};
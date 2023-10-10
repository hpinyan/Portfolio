const db = require("./DBConnection");
const Playlist = require("./models/Playlist");
const Song = require("./models/Song");

function getUserPlaylists(userId) {
  return db
    .query("SELECT * FROM playlist WHERE p_usr_id=?", [userId])
    .then(({ results }) => {
      return results.map((playlist) => new Playlist(playlist));
    });
}

function getUserPlaylistById(userId, playlistId) {
  return db
    .query("SELECT * FROM playlist WHERE p_usr_id=? AND p_id=?", [
      userId,
      playlistId,
    ])
    .then(({ results }) => {
      const playlist = new Playlist(results[0]);
      if (playlist) {
        // we found our playlist
        return playlist;
      } else {
        // if no playlist with same user id and playlist id
        throw new Error("No such playlist");
      }
    });
}

function getUserPlaylistSongs(userId, playlistId) {
  return db
    .query("SELECT * FROM song WHERE s_plist_id=? AND s_usr_id=?", [
      playlistId,
      userId,
    ])
    .then(({ results }) => {
      return results.map((song) => new Song(song));
    });
}

function createUserPlaylist(userId, playlist) {
  return db
    .query("SELECT * FROM playlist WHERE p_name=? AND p_usr_id=?", [
      playlist.name,
      playlist.userId,
    ])
    .then(({ results }) => {
      if (results.length > 0) {
        // we already have this playlist, use put instead
        throw new Error("Playlist already exists");
      }

      // new playlist (good)
      return db
        .query("INSERT INTO playlist (p_usr_id, p_name) VALUES (?, ?)", [
          userId,
          playlist.name,
        ])
        .then(({ results }) => {
          return getUserPlaylistById(userId, results.insertId);
        });
    });
}

function addSongToPlaylist(userId, playlistId, mbid) {
  console.log(userId, playlistId, mbid);
  return db
    .query(
      "SELECT * FROM song WHERE s_usr_id=? AND s_plist_id=? AND s_mbid=?",
      [userId, playlistId, mbid]
    )
    .then(({ results }) => {
      if (results.length > 0) {
        // we already have this song, use put instead
        throw new Error("Song already exists");
      }

      // new song (good)
      return db
        .query(
          "INSERT INTO song (s_plist_id, s_usr_id, s_mbid) VALUES (?, ?, ?)",
          [playlistId, userId, mbid]
        )
        .then(({ results }) => {
          return getUserPlaylistById(userId, playlistId);
        });
    });
}

function updateUserPlaylist(userId, playlist, playlistId) {
  return db
    .query("SELECT * FROM playlist WHERE p_usr_id=? AND p_id=?", [
      userId,
      playlistId,
    ])
    .then(({ results }) => {
      const foundPlaylist = new Playlist(results[0]);
      if (foundPlaylist) {
        // we found our playlist
        return db
          .query("UPDATE playlist SET p_name=? WHERE p_id=? AND p_usr_id=?", [
            playlist.name,
            playlistId,
            userId,
          ])
          .then(() => {
            return getUserPlaylistById(userId, playlistId);
          });
      } else {
        // if no playlist with same user id and playlist id
        throw new Error("No such playlist");
      }
    });
}

function deleteUserPlaylist(userId, playlistId) {
  return db
    .query("SELECT * FROM playlist WHERE p_usr_id=? AND p_id=?", [
      userId,
      playlistId,
    ])
    .then(({ results }) => {
      const foundPlaylist = new Playlist(results[0]);
      if (foundPlaylist) {
        // we found our playlist
        return db
          .query("DELETE FROM playlist WHERE p_id=? AND p_usr_id=?", [
            playlistId,
            userId,
          ])
          .then(() => {
            return foundPlaylist;
          });
      } else {
        // if no playlist with same user id and playlist id
        throw new Error("No such playlist");
      }
    });
}

// delete song from playlist
function deleteSongFromPlaylist(userId, playlistId, mbid) {
  return db
    .query(
      "SELECT * FROM song WHERE s_usr_id=? AND s_plist_id=? AND s_mbid=?",
      [userId, playlistId, mbid]
    )
    .then(({ results }) => {
      const foundSong = new Song(results[0]);
      if (foundSong) {
        // we found our song
        return db
          .query(
            "DELETE FROM song WHERE s_usr_id=? AND s_plist_id=? AND s_mbid=?",
            [userId, playlistId, mbid]
          )
          .then(() => {
            return getUserPlaylistById(userId, playlistId);
          });
      } else {
        // if no song with same user id and playlist id
        throw new Error("No such song");
      }
    });
}

// delete all songs from playlist
function deleteAllSongsFromPlaylist(userId, playlistId) {
  return db
    .query("SELECT * FROM song WHERE s_plist_id=? AND s_usr_id=?", [
      playlistId,
      userId,
    ])
    .then(({ results }) => {
      const foundSongs = results.map((song) => new Song(song));
      if (foundSongs) {
        // we found our song
        return db
          .query("DELETE FROM song WHERE s_plist_id=? AND s_usr_id=?", [
            playlistId,
            userId,
          ])
          .then(() => {
            return getUserPlaylistById(userId, playlistId);
          });
      } else {
        // if no song with same user id and playlist id
        throw new Error("No such song");
      }
    });
}

module.exports = {
  getUserPlaylists,
  getUserPlaylistById,
  createUserPlaylist,
  getUserPlaylistSongs,
  addSongToPlaylist,
  updateUserPlaylist,
  deleteUserPlaylist,
  deleteSongFromPlaylist,
  deleteAllSongsFromPlaylist,
};

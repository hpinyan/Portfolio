import "../css/Playlist.css";
import HomeHeader from "./HomeHeader";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import api from "./APIClient.js";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

function ProfilePlaylists() {
  const navigate = useNavigate();
  const location = useLocation();
  const [text, setText] = useState("");
  const [playlistState, setPlaylistState] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (text === "") {
      alert("You must have a playlist name");
      event.preventDefault();
    } else {
      event.preventDefault();
      const playlistNew = {
        name: text,
      };
      if (playlistState) {
        api
          .updatePlaylist(playlistState.id, playlistNew.name)
          .then((r) => {
            console.log(r);
            setText("");
            window.location.reload();
          })
          .catch((err) => {
            navigate("/error", { state: { error: "Update Playlist Error" } });
          });
      }
    }
  };

  const handleTextAreaChange = (event) => {
    setText(event.target.value);
  };

  // Extract the value of the "id" parameter from the location object
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  // Get the playlist with the given ID and display it
  const [loading, setLoading] = useState(true);
  const [playlist, setPlaylist] = useState(null);
  useEffect(() => {
    api
      .getPlaylistById(id)
      .then((p) => {
        setPlaylist(p);
        setPlaylistState(p);
        setText(p.name);
        setLoading(false);
      })
      .catch((err) => {
        navigate("/error", { state: { error: "Get Playlist Error" } });
        setLoading(false);
      });
  }, [id, navigate]);

  return (
    <div>
      <HomeHeader />
      <div className="back-button" onClick={() => navigate(-1)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          fill="gray"
          class="bi bi-arrow-left-circle"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
          />
        </svg>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="playlist">
          <div className="profile-playlists-cont">
            <center key={id}>
              <p className="plist-title" key={id}>
                {" "}
                {playlist.name}
              </p>
              <GetPlaylistSongs playlistId={playlist.id} />
              <br />
              <br />
              <br />
            </center>
          </div>
          <div className="editPlaylist">
            <Form className="plist-form" onSubmit={handleSubmit}>
              <Form.Group className="plist-form-s" controlId="formTextArea">
                <Form.Control
                  as="textarea"
                  rows={1}
                  value={text}
                  onChange={handleTextAreaChange}
                />
              </Form.Group>
              <Button variant="primary" className="update" type="submit">
                {playlistState ? "Update" : "Save"}
              </Button>
              <Button
                variant="primary"
                className="delete"
                onClick={() => {
                  api.deleteAllSongsFromPlaylist(playlist.id).then(() => {
                    api.deletePlaylist(playlist.id).then(() => {
                      navigate(`/profile`);
                    });
                  });
                }}
              >
                Delete Playlist
              </Button>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}

function GetPlaylistSongs(playlistId) {
  const navigate = useNavigate();

  const sendToSongs = (id) => {
    navigate(`/song?id=${id}`);
  };

  const [loadingSongs, setLoadingSongs] = useState(true);
  const [listOfSongs, setListOfSongs] = useState([]);
  useEffect(() => {
    api
      .getPlaylistSongs(playlistId.playlistId)
      .then((l) => {
        setListOfSongs(l);
        // console.log(l);
        setLoadingSongs(false);
      })
      .catch((err) => {
        navigate("/error", { state: { error: "Get Playlist Songs Error" } });
        setLoadingSongs(false);
      });
  }, []);
  return (
    <div>
      {loadingSongs ? (
        <div>Loading...</div>
      ) : (
        <div className="card song-card">
          {listOfSongs.map((s, index) => (
            <div className="card pro-card " onClick={() => sendToSongs(s.mbid)} key={index}>
            {s.images && s.images.length> 0 ? (
            <img src =  {s.images[1].url} alt = {s.trackName}  className='card-img-top song-pic' />
            
              ):(
              <svg xmlns="http://www.w3.org/2000/svg" width="125" height="125" fill="lightgray" class="bi bi-person-bounding-box" viewBox="0 0 16 16">
                  <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                </svg>  
                )}
  
          <div className="card-body pro-card-body">
            <div className='card-text pro-card-title h5  '> {s.trackName}
              </div>
                <div className='card-text pro-card-text h6' > {s.artistName}</div>
              </div>
              <Button
                  variant="primary"
                  className="delete"
                  onClick={() => {
                    api
                      .deleteSongFromPlaylist(playlistId.playlistId, s.mbid)
                      .then(() => {
                        window.location.reload();
                      });
                  }}
                >
                  Delete
                </Button>
          </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfilePlaylists;

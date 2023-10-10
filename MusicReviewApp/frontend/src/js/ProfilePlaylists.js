import "../css/ProfilePlaylists.css";
import api from "./APIClient.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import CreatePlaylistModal from './CreatePlaylistModal';

function ProfilePlaylists() {
  const [text, setText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

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
      api
        .createPlaylist(playlistNew.name)
        .then((r) => {
          console.log(r);
          setText("");
          window.location.reload();
        })
        .catch((err) => {
          navigate("/error", { state: { error: "Create Playlist Error" } });
        });
    }
  };

  const handleTextAreaChange = (event) => {
    setText(event.target.value);
  };

  const navigate = useNavigate();

  const sendToPlaylist = (id) => {
    navigate(`/playlist?id=${id}`);
  };

  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [listOfPlaylists, setListOfPlaylists] = useState([]);
  useEffect(() => {
    api
      .getPlaylists()
      .then((l) => {
        setListOfPlaylists(l);
        setLoadingPlaylists(false);
      })
      .catch((err) => {
        console.log("profile error");
        setLoadingPlaylists(false);
      });
  }, []);

  return (
    <div>
      {loadingPlaylists ? (
        <div>Loading...</div>
      ) : (
        
        <div className="profile-playlists-cont">
          <Button variant="primary" type="submit" className="btn-submit" onClick={() => {        
                    setModalOpen(true);
                  }} >
                Create New Playlist
              </Button>
          {modalOpen && <CreatePlaylistModal setOpenModal={setModalOpen} />}
          {modalOpen && <div className="modalOverlay" />}
          {listOfPlaylists.map((p, index) => (
            <center key={index}>
              <p
                className="title"
                onClick={() => sendToPlaylist(p.id)}
                key={index}
              >
                {p.name}
              </p>
            </center>
          ))}
        </div>
      )}
    </div>
  );
}

// function GetPlaylistSongs(playlistId) {
//   const navigate = useNavigate();

//   const sendToSongs = (id) => {
//     navigate(`/song?id=${id}`);
//   };

//   const [loadingSongs, setLoadingSongs] = useState(true);
//   const [listOfSongs, setListOfSongs] = useState([]);
//   useEffect(() => {
//     api
//       .getPlaylistSongs(playlistId.playlistId)
//       .then((l) => {
//         setListOfSongs(l);
//         // console.log(l);
//         setLoadingSongs(false);
//       })
//       .catch((err) => {
//         navigate("/error", { state: { error: "Get Playlist Songs Error" } });
//         setLoadingSongs(false);
//       });
//   }, [playlistId.playlistId]);
//   return (
//     <div>
//       {loadingSongs ? (
//         <div>Loading...</div>
//       ) : (
//         <div className="profile-songs-cont justify-content-center">
//           {listOfSongs.map((s, index) => (
//             <div className="card pro-card " onClick={() => sendToSongs(s.mbid)} key={index}>
//             {s.images && s.images.length> 0 ? (
//             <img src =  {s.images[1].url} alt = {s.trackName}  className='card-img-top song-pic' />
            
//               ):(
//               <svg xmlns="http://www.w3.org/2000/svg" width="125" height="125" fill="lightgray" class="bi bi-person-bounding-box" viewBox="0 0 16 16">
//                   <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
//                   <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
//                 </svg>  
//                 )}
  
//           <div className="card-body pro-card-body">
//             <div className='card-text pro-card-title h5  '> {s.trackName}
//               </div>
//                 <div className='card-text pro-card-text h6' > {s.artistName}</div>
//               </div>
//           </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

export default ProfilePlaylists;

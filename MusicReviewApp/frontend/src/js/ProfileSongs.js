import '../css/ProfileSongs.css';
import api from './APIClient.js';
import { useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

function ProfileSongs() {

  const [loading, setLoading] = useState(true);
  const [listOfSongs, setListOfSongs] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
      api.getSongReviews().then(l => {
          console.log(l);
        setListOfSongs(l);
        setLoading(false);
      }).catch((err) => {
        navigate("/error", { state: { err: "Get Song Reviews Error" } });
        setLoading(false);
      })
  }, [navigate])

  const sendToSongs = (id) => {
    navigate(`/song?id=${id}`);
  };

  return (
    <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="profile-songs-cont justify-content-center">
          
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
                        
                        <button type="button" className="btn btn-tertiary ">
                          Rating <span className="ps-my-span">{s.score}</span>
                        </button>
                      </div>
                  </div>
                
                
              ))}
        
          </div>
          //       <div className='profile-songs-cont'>
          //     {listOfSongs.map((s, index) => (
          //       <center onClick={() => sendToSongs(s.mbid)} key={index}>
          //         <div className='pic-border-song'>
          //           <img src = {s.images[1].url} alt = {s.trackName} className='song-pic' />
          //         </div>
          //         <p>Song: {s.trackName}</p>
          //         <p>Artist: {s.artistName}</p>
          //         <p>Rating: {s.score}</p>
          //         <hr/>
          //       </center>
          //     ))}
          // </div>
   )}
     </div>
  );
}

export default ProfileSongs;
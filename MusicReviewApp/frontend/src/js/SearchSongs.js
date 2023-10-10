import '../css/SearchSongs.css';
import Card from 'react-bootstrap/Card';
import {useNavigate} from 'react-router-dom';
import api from './APIClient.js';
import { useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';

function SearchSongs() {

    const [listOfSongs, setListOfSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const type = "track";
        const query = document.getElementById("search-query").value;
        api.getSearch(type, query).then(l => {
            console.log(l);
            setListOfSongs(l.tracks.items);
            setLoading(false);
        }).catch((err) => {
          navigate("/error", { state: { err: "Search Error" } });
          setLoading(false);
        })
    }, [navigate])

    const sendToPage = (id) => {
        navigate(`/song?id=${id}`);
    }
    return (
      <div>
  {loading ? (
    <div>Loading...</div>
  ) : (
        <div className='search-songs-cont'>
    {listOfSongs.map((a, index) => (
     
          <div key={index} onClick={() => sendToPage(a.id)}  className="card ss-card">
             <center>
            {a.album.images && a.album.images.length > 0 ? (
              <img className="card-img-top ss-card-image mr-3" src={a.album.images[0].url} alt="Search Songs"/>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="125" height="125" fill="lightgray" class="bi bi-person-bounding-box" viewBox="0 0 16 16">
            <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
          </svg>
              
            )}
          
         
          <div className='card-title ss-card-title'>{a.name}</div>
          <div className="list-group mygenre">
          {a.artists && a.artists.length > 0 ? (
            a.artists.map((a, index2) => (
              <div className='list-group-item sa-card-text' key={index2}>{a.name}</div>
            ))
          ) : (
            <div className="sa-card-text2">No artist available</div>
          )}
        </div>
        </center>
        </div>
        
     
      
    ))}
  </div>
  )}
</div>
);
}

export default SearchSongs;
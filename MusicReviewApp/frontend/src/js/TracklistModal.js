import '../css/TracklistModal.css';
import React from "react";
import api from './APIClient.js';
import { useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

function TracklistModal({albumId, setTOpenModal }) {


  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [listOfSongs, setListOfSongs] = useState([]);
  useEffect(() => {
      api.getByMbid("album", albumId).then(l => {
        console.log(l);
        setListOfSongs(l);
        setLoading(false);
      }).catch((err) => {
        navigate("/error", { state: { err: "Tracklist Error" } });
        setLoading(false);
      })
  }, [albumId])

  const sendToSong = (id) => {
    navigate(`/song?id=${id}`);
  };
  
  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="card t-modalContainer">
       
          
          <div className="t-titleCloseBtn">
        
          <button
            onClick={() => {
              setTOpenModal(false);
            }}
          >
           <i className="bi bi-x-square"></i>
          </button>
        </div>
        
            <h4 className='t-ta-title bg-secondary mt-1 text-white p-1'>Tracklist</h4>
       
        
         
              <div className='  p-6'>
              <center>
                <img src={listOfSongs.images[1].url} width="150"  alt={listOfSongs.name} className='card-img-left' />
              
              
                <div className="h6">Album: {listOfSongs.name}</div>
                <p>Artist: {listOfSongs.artists[0].name}</p>
             
                </center>
            <hr />
            <ul className="list-group tl-list-group tlist-cont">

              {listOfSongs.tracks.items.map((s, index) => (
                    
                     <li className='"d-flex flex-row ' onClick={() =>sendToSong(s.id)} key={index}>{index + 1}. {s.name}</li>
                     
              ))}
              
            </ul>          
           
           
            </div>
           
      </div>
      )}
    </div>
  );
}
export default TracklistModal;
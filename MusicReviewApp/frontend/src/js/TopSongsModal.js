import '../css/TopSongsModal.css';
import React from "react";
import api from './APIClient.js';
import { useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

function TopSongsModal({artistId, setTsOpenModal }) {

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [listOfSongs, setListOfSongs] = useState([]);
  useEffect(() => {
      api.getTopSongsByArtist(artistId).then(l => {
        console.log(l);
        setListOfSongs(l);
        setLoading(false);
      }).catch((err) => {
        navigate("/error", { state: { err: "Top Songs Error" } });
        setLoading(false);
      })
  }, [artistId, navigate])

  const sendToSong = (id) => {
    navigate(`/song?id=${id}`);
  };
  
    return (
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="ts-modalContainer">
          <div className="ts-titleCloseBtn">
            <button
              onClick={() => {
                setTsOpenModal(false);
              }}
            >
             <i className="bi bi-x-square"></i>
            </button>
          </div>
          <h4 className='ts-title bg-secondary mt-1 text-white p-1 '>Top Rated Songs</h4>
          <div className="ts-top-album-list">
          {listOfSongs.length > 0 ? (
                listOfSongs.slice(0,10).map((a, index) => (
                    <center onClick={() => sendToSong(a.mbid)} className='ts-list-el-cont' key={index}>
                      <div className='ts-top-album-container'>
                        <div className='ts-pic-container'>
                          <img src={a.images[1].url} alt={a.albumName} className='ts-top-album-pic' />
                        </div>
                        <div className='ts-info-container'>
                          <p>Song: <b>{a.trackName}</b></p>
                          <p>Artist: <b>{a.artistName}</b></p>
                          <p>Rating: <b>{a.score}</b></p>
                        </div>
                      </div>
                      <hr />
                    </center>
                  ))
            ) : (
                <h4>No Reviewed Songs</h4>
            )}
          </div>
        </div>
        )}
      </div>
    );
  }
  export default TopSongsModal;
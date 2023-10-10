import '../css/TopAlbumModal.css';
import React from "react";
import api from './APIClient.js';
import { useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

function TopAlbumModal({artistId, setOpenModal }) {

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [listOfAlbums, setListOfAlbums] = useState([]);
  useEffect(() => {
      api.getTopAlbumsByArtist(artistId).then(l => {
        console.log(l);
        setListOfAlbums(l);
        setLoading(false);
      }).catch((err) => {
        navigate("/error", { state: { err: "Top Album Error" } });
        setLoading(false);
      })
  }, [artistId, navigate])

  const sendToAlbum = (id) => {
    navigate(`/album?id=${id}`);
  };
  
  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="t-modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
             <i className="bi bi-x-square"></i>
          </button>
        </div>
        <h3 className='t-ta-title bg-secondary mt-1 text-white p-1'>Top Rated Albums</h3>
        <div className="top-album-list">
          {listOfAlbums.length > 0 ? (
              listOfAlbums.slice(0,10).map((a, index) => (
                  <center onClick={() => sendToAlbum(a.mbid)} className='list-el-cont' key={index}>
            <div className='top-album-container'>
              <div className='pic-container'>
                <img src={a.images[1].url} alt={a.albumName} className='top-album-pic' />
              </div>
              <div className='info-container'>
                <p>Album:<b> {a.albumName}</b></p>
                <p>Artist: <b>{a.artistName}</b></p>
                <p>Rating:<b> {a.score}</b></p>
              </div>
            </div>
            <hr />
          </center>
                ))
          ) : (
              <h4>No Reviewed Albums</h4>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
export default TopAlbumModal;
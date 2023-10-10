import '../css/AddSongModal.css';
import React from "react";
import api from './APIClient.js';
import { useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { Form, Button } from "react-bootstrap";

function AddSongModal({track, setSOpenModal }) {

    const navigate = useNavigate();
    const [loadingPlaylists, setLoadingPlaylists] = useState(true);
    const [listOfPlaylists, setListOfPlaylists] = useState([]);
    useEffect(() => {
      api
        .getPlaylists()
        .then((l) => {
            console.log(track);
          setListOfPlaylists(l);
          setLoadingPlaylists(false);
        })
        .catch((err) => {
          navigate("/error", { state: { error: "Get Playlist Error" } });
          setLoadingPlaylists(false);
        });
    }, []);

    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    const handlePlaylistChange = (e) => {
      setSelectedPlaylist(e.target.value);
    }

    const handleSubmit = (e) => {
      e.preventDefault();
      let plist_id = selectedPlaylist;
      if (plist_id === null && listOfPlaylists.length > 0) {
        plist_id = listOfPlaylists[0].id;
      }
      api.addSongToPlaylist(plist_id, track.id).then((res) => {
        console.log(res);
        setSOpenModal(false);
      }).catch((err) => {
        navigate("/error", { state: { error: err } });
      });
    }
  
  return (
    <div>
      {loadingPlaylists ? (
        <div>Loading...</div>
      ) : (
        <div className="card add-modalContainer">
       
          
          <div className="add-titleCloseBtn">
        
          <button
            onClick={() => {
              setSOpenModal(false);
            }}
          >
           <i className="bi bi-x-square"></i>
          </button>
        </div>
        
            <h4 className='add-title bg-secondary mt-1 text-white p-1'>Add Song To Playlist</h4>
            <div className="add-playlist">
            <Form onSubmit={handleSubmit}>
            <Form.Group controlId="exampleForm.SelectCustom">
                <Form.Label>Select Playlist</Form.Label>
                <Form.Control className="show-plist" as="select" custom onChange={handlePlaylistChange}>
                {listOfPlaylists.map((p) => {
                    return <option value={p.id}>{p.name}</option>
                }
                )}
                </Form.Control>
            </Form.Group>
            <Button className="add-song" variant="primary" type="submit">
                Add
            </Button>
            </Form>
        </div>
      </div>
      )}
    </div>
  );
}
export default AddSongModal;
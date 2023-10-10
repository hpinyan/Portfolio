import '../css/CreatePlaylistModal.css';
import React from "react";
import api from './APIClient.js';
import { useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { Form, Button } from "react-bootstrap";

function CreatePlaylistModal({setOpenModal }) {

    const navigate = useNavigate();
    const [text, setText] = useState("");
  
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
  return (
        <div className="card c-modalContainer">
       
          
          <div className="c-titleCloseBtn">
        
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
           <i className="bi bi-x-square"></i>
          </button>
        </div>
        
            <h4 className='c-title bg-secondary mt-1 text-white p-1'>Create Playlist</h4>
            <Form  onSubmit={handleSubmit}>
            <Form.Group controlId="formTextArea">
              <Form.Label>Playlist Name</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                value={text}
                placeholder="Enter playlist name"
                onChange={handleTextAreaChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Create Playlist
            </Button>
          </Form>
      </div>
  );
}
export default CreatePlaylistModal;
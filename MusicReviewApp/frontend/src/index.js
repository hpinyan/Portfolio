import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import Home from './js/home';
import Login from './js/Login';
import Register from './js/Register';
import Profile from './js/Profile';
import Song from './js/Song';
import Search from './js/Search';
import Album from './js/Album'
import Artist from './js/Artist';
import Offline from './js/Offline';
import Playlist from './js/Playlist';
import ErrorPage from './js/ErrorPage';
import api from './js/APIClient';

const root = ReactDOM.createRoot(document.getElementById('root'));
let user = false;
api.getCurrentUser().then(u => {
  if(u) {
    user = true;
    console.log("YES");
    addRoutes();
  }
}).catch((err) => {
  console.log(err.message);
  addRoutes(err.message);
});

function addRoutes(err) {
  root.render(
    <Router>
        <Routes>
          <Route path="/" element = {<Login/>} />
          <Route path="/home" element={user ? <Home /> : <ErrorPage location={{ state: { err } }}/> }/>
          <Route path="/register" element = {<Register/>} />
          <Route path="/profile" element={user ? <Profile /> : <ErrorPage location={{ state: { err } }} /> } />
          <Route path="/song" element={user ? <Song /> : <ErrorPage location={{ state: { err } }}/> }/>
          <Route path="/search" element={user ? <Search /> : <ErrorPage location={{ state: { err } }}/> } />
          <Route path="/album" element={user ? <Album /> : <ErrorPage location={{ state: { err } }}/> } />
          <Route path="/artist" element={user ? <Artist /> : <ErrorPage location={{ state: { err } }}/> } />
          <Route path="/playlist" element={user ? <Playlist /> : <ErrorPage location={{ state: { err } }}/> } />
          <Route path="/error" element={<ErrorPage location={{ state: { err } }} />} />
          <Route path="/offline" element = {<Offline/>} />
        </Routes>
      </Router>
  );
}

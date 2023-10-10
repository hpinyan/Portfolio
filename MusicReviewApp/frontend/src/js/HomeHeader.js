import React from 'react';
import '../css/HomeHeader.css';
import {useNavigate} from 'react-router-dom';
import api from './APIClient.js';
import 'bootstrap/dist/css/bootstrap.css';

function HomeHeader() {
  
  const navigate = useNavigate();

  const sendToHome = () => {
    navigate(`/home`);
  }

  const sendToProfile = () => {
    navigate(`/profile`);
  }

  const sendToSearch = () => {
    navigate(`/search`);
  }

  const sendToLogin = () => {
    api.logout().then(u => {
      navigate(`/`);
      navigate(0);
    }).catch((err) => {
      navigate("/error", { state: { err: "Error Logging Out" } });
    })
  }

  return (
    <header>
      <h1 onClick={sendToHome}>mUsify</h1>
      <i className="bi bi-person-fill header-icon" onClick={sendToProfile}></i>
      <i className="bi bi-house header-icon" onClick={sendToHome}></i>
      <i className="bi bi-search header-icon" onClick={sendToSearch}></i>
      <i className="bi bi-box-arrow-right header-icon" onClick={sendToLogin}></i>
    </header>
  );
}

export default HomeHeader;
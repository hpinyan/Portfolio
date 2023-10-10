import '../css/Login.css';
import api from './APIClient.js';
import {useNavigate} from 'react-router-dom';
import { useState} from 'react';

function Login() {

  const navigate = useNavigate();
  const [alertOpen, setAlertOpen] = useState(false);
  const sendToRegister = () => {
    navigate(`/register`);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const username = event.target.elements['username-input'].value;
    const password = event.target.elements['password-input'].value;
    //api call if success -> go to home, if fail do error box
    api.logIn(username, password).then(userData => {
      document.location = "/home";
    }).catch((err) => {
      setAlertOpen(true);
    });
  };

  return (
    <div className="login">
      {alertOpen && <div className="alert alert-danger" role="alert">
        username or password incorrect
      </div>}
      <h1 className="login-header">Login</h1>
        <form className='li-form' onSubmit={handleSubmit}>
            <label htmlFor="username-input">Username:</label>
            <input className = "username-input" id="username-input" placeholder="Enter your username" />
            <label htmlFor="password-input">Password:</label>
            <input type="password" id="password-input" placeholder="Enter your password" />
            <button type="submit" className="login-button">Login</button>
            <button className='register-button-login' onClick={sendToRegister} >Register</button>
        </form>
    </div>
  );
}

export default Login;
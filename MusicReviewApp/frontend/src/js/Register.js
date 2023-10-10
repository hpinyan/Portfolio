import '../css/Register.css';
import api from './APIClient.js';
import {useNavigate} from 'react-router-dom';
import { useState} from 'react';
function Register() {

  const navigate = useNavigate();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertOpen2, setAlertOpen2] = useState(false);
  const [alertOpen3, setAlertOpen3] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const username = event.target.elements['username-input'].value;
    const password = event.target.elements['password-input'].value;
    const password2 = event.target.elements['password-input2'].value;
    const fname = event.target.elements['fname-input'].value;
    const lname = event.target.elements['lname-input'].value;
    if(username === "" || password === "" || password2 === "" || fname === "" || lname === "") {
      setAlertOpen2(true);
      setAlertOpen(false);
      setAlertOpen3(false);
    } else {
      if(password !== password2) {
        setAlertOpen(true);
        setAlertOpen2(false);
        setAlertOpen3(false);
      } else {
        //api call if success -> go to login, if fail do error box
        api.register(username, password, fname, lname).then(userData => {
          navigate("/");
        }).catch((err) => {
          setAlertOpen(false);
          setAlertOpen2(false);
          setAlertOpen3(true);
        });
    }
    }
  };

  return (
    <div className="register">
      {alertOpen && <div className="alert alert-danger" role="alert">
        Please ensure confirm password and password are equal
      </div>}
      {alertOpen2 && <div className="alert alert-danger" role="alert">
        Ensure all fields are entered
      </div>}
      {alertOpen3 && <div className="alert alert-danger" role="alert">
        Username is taken
      </div>}
        <h1 className="register-header">Register</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="username-input">Username:</label>
            <input className = "username-input" id="username-input" placeholder="Enter your username" />
            {/* <label htmlFor="email-input">Email:</label>
            <input type="email" id="email-input" placeholder="Enter your email" /> */}
            <label htmlFor="fname-input">First Name:</label>
            <input className = "name-input" type="text" id="fname-input" placeholder="Enter your first name" />
            <label htmlFor="lname-input">Last Name:</label>
            <input className = "name-input" type="text" id="lname-input" placeholder="Enter your last name" />
            <label htmlFor="password-input">Password:</label>
            <input type="password" id="password-input" placeholder="Enter your password" />
            <label htmlFor="password-input2">Confirm Password:</label>
            <input type="password" id="password-input2" placeholder="Enter your password" />
            <button type="submit" className="register-button">Register</button>
        </form>
    </div>
  );
}

export default Register;
import '../css/Profile.css';
import HomeHeader from './HomeHeader';
import ProfileMenu from './ProfileMenu';
import api from './APIClient.js';
import { useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import placeholder from '../images/placeholder.jpg';
import 'bootstrap/dist/css/bootstrap.css';


function Profile() {

  const [u, setU] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
      api.getCurrentUser().then(user => {
        setU(user);
      }).catch((err) => {
        navigate("/error", { state: { err: "Get Current User Error" } });
      })
  }, [navigate])

  return (
    <div>
      <HomeHeader/>
      <center>
        <div className='top-part-cont'>
          <div className='pic-border'>
              <img src = {placeholder} alt = "Profile" className='profile-pic' />
          </div>
          <h1>{u.username}</h1>
        </div>

        <ProfileMenu/>
      </center>
    </div>
  );
}

export default Profile;
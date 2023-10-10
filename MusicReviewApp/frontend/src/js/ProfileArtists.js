import '../css/ProfileArtists.css';
import api from './APIClient.js';
import { useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

function ProfileArtists() {

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
    const [listOfArtists, setListOfArtists] = useState([]);
    useEffect(() => {
        api.getArtistSortedReviews().then(l => {
            console.log(l);
          setListOfArtists(l);
          setLoading(false);
        }).catch((err) => {
          navigate("/error", { state: { err: "Get Artist Sorted Reviews Error" } });
          setLoading(false);
        })
    }, [navigate])

    const sendToArtist = (id) => {
      navigate(`/artist?id=${id}`);
    };

  return (
    <div>
    {loading ? (
      <div>Loading...</div>
    ) : (
      <div className='profile-artists-cont '>
        <table className=" table table-striped table-bordered">
            <thead>
                <tr>
                <th>Rank</th>
                <th>Rating</th>
                <th>Artist</th>
                </tr>
            </thead>
            <tbody>
                {listOfArtists.map((a, index) => (
                    <tr onClick={() => sendToArtist(a.mbid)} key={index}>
                    <td>{index+1}</td>
                    <td>{a.score}</td>
                    <td>{a.artistName}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    )}
  </div>
  );
}

export default ProfileArtists;
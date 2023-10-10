import '../css/SearchArtists.css';
import Card from 'react-bootstrap/Card';
import {useNavigate} from 'react-router-dom';
import api from './APIClient.js';
import { useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';



function SearchArtists() {

  const [loading, setLoading] = useState(true);
  const [listOfArtists, setListOfArtists] = useState([]);
  useEffect(() => {
      const type = "artist";
      const query = document.getElementById("search-query").value;
      api.getSearch(type, query).then(l => {
          console.log(l.artists);
        setListOfArtists(l.artists.items);
        setLoading(false);
      }).catch((err) => {
        navigate("/error", { state: { err: "Search Error" } });
        setLoading(false);
      })
  }, [])

    const navigate = useNavigate();
    const sendToPage = (id) => {
        navigate(`/artist?id=${id}`);
    }
    return (
      <div>
  {loading ? (
    <div>Loading...</div>
  ) : (
   
    <div className='search-artists-cont'>
       
    {listOfArtists.map((a, index) => (
      <div key={index}>
                 
        <div className="card sa-card"  onClick={() => sendToPage(a.id)} >
          
        <center>
                       
                 
                  {a.images && a.images.length > 0 ? (
                <img  className='card-img-top sa-card-image'  src={a.images[0].url}  />
              ) : (
               

                <svg xmlns="http://www.w3.org/2000/svg" width="125" height="125" fill="lightgray" className="bi bi-person-bounding-box" viewBox="0 0 16 16">
                <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
              </svg>
                  
                )}
               </center>
                
                <center className="card-body">
              
              
           
              <div className="card-title sa-card-title ">
                {a.name}
              </div>
              <div className="list-group mygenre">
              {a.genres && a.genres.length > 0 ? (
                a.genres.map((g, index2) => (
                  
                  <div  key={index2} className=" list-group-item sa-card-text">
                        {g}
                  </div>
                  
                ))
                
              ) : (
               <div className=" sa-card-text2">No genre available</div>
              )}
              </div>
            </center>

          </div>
          </div>
     
    ))}

  </div>
  
  )}
</div>
);
}

export default SearchArtists;
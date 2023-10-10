import '../css/Album.css';
import HomeHeader from './HomeHeader';
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import api from './APIClient.js';
import {useNavigate, useLocation} from 'react-router-dom';
import TracklistModal from './TracklistModal.js';
import 'bootstrap/dist/css/bootstrap.css';

function Album() {

  const [loading, setLoading] = useState(true);
    const [text, setText] = useState("");
    const [rate, setRate] = useState(0.0);
    const [prev, setPrev] = useState(null);
    const [tModalOpen, setTModalOpen] = useState(false);
    const [reviewState, setReviewState] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = (event) => {
      if(rate < 0 && rate > 10) {
        alert("Value for rating must be 0.0-10.0");
        event.preventDefault();
      } else if( text === "") {
        alert("You must have a review");
        event.preventDefault();
      } else {
        event.preventDefault();
        var liked = false;
        if(rate >= 5) {
          liked = true;
        }
        console.log(text + " " + rate); // do something with the submitted text
        const review = {
          type: "album",
          mbid: id,
          score: parseFloat(rate),
          liked: liked,
          method: null,
          review: text
        };
        if(prev) {
          api.updateReview(review, prev).then(r => {
            console.log(r);
              setText("");
              setRate(0);
              window.location.reload();
          }).catch((err) => {
            navigate("/error", { state: { err: "Update Review Error" } });
          })
        } else {
          api.createReview(review).then(r => {
            console.log(r);
            setText("");
            setRate(0);
            window.location.reload();
        }).catch((err) => {
          navigate("/error", { state: { err: "Create Review Error" } });
        })
        }
      }
    };
  
    const handleTextAreaChange = (event) => {
      setText(event.target.value); // update text state on text area change
    };

    const handleRateChange = (event) => {
      setRate(event.target.value); // update text state on text area change
    };

    const sendToArtist = (id) => {
      navigate(`/artist?id=${id}`);
    };

    const location = useLocation();

    // Extract the value of the "id" parameter from the location object
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const [album, setAlbum] = useState({});
    useEffect(() => {
      const type = "album";
      api.getByMbid(type, id).then(l => {
          console.log(l);
          setAlbum(l);
          api.getUserReviewByMbid(id).then(r => {
            setReviewState(r);
            console.log(r);
            setPrev(r.id);
            setText(r.review);
            setRate(r.score);
          }).catch((err2) => {
            console.log(err2.name);
          })
          setLoading(false);
      }).catch((err) => {
        navigate("/error", { state: { err: "Get By MBid Error --album" } });
        setLoading(false);
      })
  }, [id, navigate])

 
  return (
    <div>
    {loading ? (
      <div>Loading...</div>
    ) : (
<div>
      <HomeHeader />
      <div className='album-container'>
      <div className="back-button"
           onClick={()=>navigate(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="gray" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
          </svg>
        </div>
        <center>
      <div className="card album-card">
        {album.images && album.images.length> 0 ? (
        <img src={album.images[0].url} alt="Album Cover" className="card-img-top album-pic" />
        
           ):(
          <svg xmlns="http://www.w3.org/2000/svg" width="125" height="125" fill="lightgray" class="bi bi-person-bounding-box" viewBox="0 0 16 16">
              <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
            </svg>  
            )}
            <div className="card-body ">
          <div className="card-text album-card-title h6 ">{album.name}</div>
        
         {/* <h2 className="album-artist album-info-h2" onClick={() => sendToArtist(album.artists[0].id)}>{album.artists[0].name}</h2> */}
          
         <div><b>Rating</b>: <span className='my-span'>{reviewState ? reviewState.score : "N/A"}</span></div>
         
                   <div className="btn btn-secondary m-2" onClick={() => {        
                    setTModalOpen(true);
                  }}
              >View Tracklist</div>
            {tModalOpen && <TracklistModal albumId = {id} setTOpenModal={setTModalOpen} />}
          {tModalOpen && <div className="modalOverlay" />}
        </div>
        
      </div>
      </center>
      <hr className="album-divider" />    
    
     
      <center>       
      <div className="card m-4">
      <Form onSubmit={handleSubmit}>
          
          <h3>Song Rating/Review</h3> <label>
                    <input min={0.0} max={10.0} type="number" step="0.1" value={rate} onChange={handleRateChange} onBlur={(e) => e.target.value = parseFloat(e.target.value).toFixed(1)} className="text-center num-rate" name="rate-song" placeholder='Rating...'/>
                  </label>   
            <Form.Group className="div-review-txt-cont" controlId="formTextArea">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Review..."
                value={text}
                onChange={handleTextAreaChange}
                className="form-control"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-submit">
              {reviewState ? "Update" : "Save"}
            </Button>
          </Form>
  </div>
  </center>
    </div>
    
    </div>
    


    )}
    
  </div>
  );
}

export default Album;
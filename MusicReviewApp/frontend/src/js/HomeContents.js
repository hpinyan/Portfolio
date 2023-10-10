import React from 'react';
import '../css/HomeContents.css';
import api from './APIClient.js';
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {useNavigate} from 'react-router-dom';

function HomeContents() {

    const [loading, setLoading] = useState(true);
    const [hotSongs, setHotSongs] = useState([]);
    const [favSongs, setFavSongs] = useState([]);
    const [favAlbums, setFavAlbums] = useState([]);
    const [recentReviews, setRecentReviews] = useState([]);
    const navigate = useNavigate();
    const sendToPage = (type, id) => {
        navigate(`/${type}?id=${id}`);
    }

    useEffect(() => {
        api.getHotSongs().then(h => {
            setHotSongs(h.items);
            api.getFavoriteSongs().then(s => {
                setFavSongs(s);
                api.getFavoriteAlbums().then(a => {
                    setFavAlbums(a);
                    console.log(a);
                    api.getRecentlyReviewed().then(r => {
                        setRecentReviews(r);
                        console.log(r);
                        setLoading(false);
                    }).catch((err4) => {
                        navigate("/error", { state: { err: "Get Recently Reviewed Error" } });
                    })
                }).catch((err3) => {
                    navigate("/error", { state: { err: "Get Fav Albums Error" } });
                });
            }).catch((err2) => {
                navigate("/error", { state: { err: "Get Fav Songs Error" } });
            })
        }).catch((err) => {
          navigate("/error", { state: { err: "Get Hot Songs Error" } });
          setLoading(false);
        })
    }, [navigate])

    return (
        <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
            <section>
                <div>
                    <div className="h3 contents-header">
                        Hot Songs
                    </div>
                    <div className="home-cont">            
                    <div className='home-images'>
                        {hotSongs.slice(0, 10).map((h, index) => (
                            <div className="home-im-cont" onClick={() => sendToPage("song", h.track.id)} key={index}>
                                {h.track.album.images && h.track.album.images.length > 0 ? (
                                    <div  className={h.images && h.images.length < 10 ? "im-cont-centered" : "im-cont"}>
                                        <img className='image-sizing' src={h.track.album.images[1].url} alt={`${index}`} />
                                        </div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="lightgray" className="bi bi-person-bounding-box" viewBox="0 0 16 16">
                                        <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
                                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                      </svg>  
                                    )}
                                <br/>
                                <h4>{index + 1}. {h.track.name}</h4>
                            </div>
                        ))}
                    </div>
                    </div>
                </div>
                <div>
                    <div className="h3 contents-header">
                        Favorite Songs
                    </div>
                    <center>
                    <div className="home-cont">    
                    <div className='home-images'>
                    {favSongs.length > 0 ? (
                        
                        favSongs.slice(0, 10).map((s, index) => (
                            <div className="home-im-cont" onClick={() => sendToPage("song", s.mbid)} key={index}>
                                {s.images && s.images.length > 0 ? (
                                     <div  className={s.images && s.images.length < 10 ? "im-cont-centered" : "im-cont"}>
                                    <img className='image-sizing' src={s.images[1].url} alt={`${index}`} />
                                    </div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="lightgray" className="bi bi-person-bounding-box" viewBox="0 0 16 16">
                                        <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
                                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                      </svg>  
                                    )}
                                <br/>
                                <h4>{index + 1}. {s.trackName}</h4>
                            </div>
                           
                        ))
                    ) : (
                        <h2>No Reviewed Songs</h2>
                    )}
                    
                    </div>
                    
                    </div>
                    </center>
                </div>
                <div>
                <div className="h3 contents-header">
                        Favorite Albums
                    </div>
                    <div className='home-images'>
                    {favAlbums.length > 0 ? (
                        favAlbums.slice(0, 10).map((a, index) => (
                            <div className="home-im-cont" onClick={() => sendToPage("album", a.mbid)} key={index}>
                                {a.images && a.images.length > 0 ? (
                                     <div  className={a.images && a.images.length < 10 ? "im-cont-centered" : "im-cont"}>
                                    <img className='image-sizing' src={a.images[1].url} alt={`${index}`} />
                                    </div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="lightgray" className="bi bi-person-bounding-box" viewBox="0 0 16 16">
                                        <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
                                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                      </svg>  
                                    )}
                                <br/>
                                <h4>{index + 1}. {a.albumName}</h4>
                            </div>
                        ))
                    ) : (
                        <h2>No Reviewed Albums</h2>
                    )}
                    </div>
                </div>
                <div>
                <div className="h3 contents-header">
                        Recently Reviewed
                    </div>
                    <div className='home-images'>
                        {recentReviews.length > 0 ? (
                            recentReviews.slice(0, 10).map((r, index) => (
                                <section className="home-im-cont content-flex" onClick={() => sendToPage(r.type, r.mbid)} key={index}>
                                    {r.images && r.images.length > 0 ? (
                                        <div  className={r.images && r.images.length < 10 ? "im-cont-centered" : "im-cont"}>
                                       
                                        <img className='image-sizing' src={r.images[1].url} alt={`${index}`} />
                                        </div>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="lightgray" className="bi bi-person-bounding-box" viewBox="0 0 16 16">
                                            <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
                                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                          </svg>  
                                      
                                        )}
                                    <br/>
                                    {r.type === "artist" && <h4>{index + 1}. {r.artistName}</h4>}
                                    {r.type === "album" && <h4>{index + 1}. {r.albumName}</h4>}
                                    {r.type === "song" && <h4>{index + 1}. {r.trackName}</h4>}
                                </section>
                            ))
                        ) : (
                            <h2>No Reviews</h2>
                        )}
                    </div>
                </div>
            </section>
        )}
        </div>
          );
        }
        
        export default HomeContents;
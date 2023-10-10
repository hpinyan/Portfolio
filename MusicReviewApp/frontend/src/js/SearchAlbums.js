import "../css/SearchAlbums.css";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import api from "./APIClient.js";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

function SearchAlbums() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const sendToPage = (id) => {
    navigate(`/album?id=${id}`);
  };

  const [listOfAlbums, setListOfAlbums] = useState([]);
  useEffect(() => {
    const type = "album";
    const query = document.getElementById("search-query").value;
    api
      .getSearch(type, query)
      .then((l) => {
        console.log(l);
        setListOfAlbums(l.albums.items);
        setLoading(false);
      })
      .catch((err) => {
        navigate("/error", { state: { err: "Search Error" } });
        setLoading(false);
      });
  }, [navigate]);
  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="search-albums-cont">
          {listOfAlbums.map((a, index) => (
            <div
              className="card sal-card"
              onClick={() => sendToPage(a.id)}
              key={index}
            >
              <center>
                {a.images && a.images.length > 0 ? (
                  <img
                    className="card-image-top sal-card-image mr-3"
                    src={a.images[0].url}
                    alt="Search Albums"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="125"
                    height="125"
                    fill="lightgray"
                    class="bi bi-person-bounding-box"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z" />
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  </svg>
                )}

                <div className="card-body">
                  <div className="card-title sa-card-title ">{a.name}</div>
                  <div className="list-group mygenre">
                    {a.artists && a.artists.length > 0 ? (
                      a.artists.map((a, index2) => (
                        <div className="list-group-item sal-card-text" key={index2}>
                          {a.name}
                        </div>
                      ))
                    ) : (
                      <div className="sal-card-text2 ">No artist available</div>
                    )}
                  </div>
                </div>
              </center>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchAlbums;
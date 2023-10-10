import { useState } from 'react';
import '../css/SearchMenu.css';
import SearchArtists from './SearchArtists';
import SearchAlbums from './SearchAlbums';
import SearchSongs from './SearchSongs';

function SearchMenu() {
    const [showArtists, setShowArtists] = useState(true);
    const [showAlbums, setShowAlbums] = useState(false);
    const [showSongs, setShowSongs] = useState(false);
    const [artistsClick, setArtistsClick] = useState(true);
    const [albumsClick, setAlbumsClick] = useState(false);
    const [songsClick, setSongsClick] = useState(false);


    const handleArtistsClick = () => {
        if(!showArtists) {
            setArtistsClick(true);
            setAlbumsClick(false);
            setSongsClick(false);
            setShowArtists(true);
            setShowAlbums(false);
            setShowSongs(false);
        }
        //change for other elements
    }

    const handleAlbumsClick = () => {
        if(!showAlbums) {
            setShowAlbums(true);
            setShowArtists(false);
            setShowSongs(false);
            

            setArtistsClick(false);
            setAlbumsClick(true);
            setSongsClick(false);
        }
        //change for other elements
    }

    const handleSongsClick = () => {
        if(!showSongs) {
            setShowSongs(true);
            setShowArtists(false);
            setShowAlbums(false);
            
            setSongsClick(true);
            setArtistsClick(false);
            setAlbumsClick(false);
        }
        //change for other elements
    }

  return (
    <div className='menu-container-s'>
        <div className = "button-group-s">
            <button className={artistsClick ? "artist-click-s" : "menu-button-left-s"} onClick={handleArtistsClick}> Artists </button>
            <button className={albumsClick ? "middle-click-s" : "menu-button-s"} onClick={handleAlbumsClick}> Albums </button>
            <button className={songsClick ? "songs-click-s" : "menu-button-right-s"} onClick={handleSongsClick}> Songs </button>
        </div>
        {showArtists && <SearchArtists/>}
        {showAlbums && <SearchAlbums/>}
        {showSongs && <SearchSongs/>}
    </div>
  );
}

export default SearchMenu;
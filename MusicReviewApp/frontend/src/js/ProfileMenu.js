import { useState } from 'react';
import '../css/ProfileMenu.css';
import ProfileArtists from './ProfileArtists';
import ProfileAlbums from './ProfileAlbums';
import ProfileSongs from './ProfileSongs';
import ProfilePlaylists from './ProfilePlaylists';

function ProfileMenu() {
    const [showArtists, setShowArtists] = useState(true);
    const [showAlbums, setShowAlbums] = useState(false);
    const [showSongs, setShowSongs] = useState(false);
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [artistsClick, setArtistsClick] = useState(true);
    const [albumsClick, setAlbumsClick] = useState(false);
    const [songsClick, setSongsClick] = useState(false);
    const [playlistsClick, setPlaylistsClick] = useState(false);


    const handleArtistsClick = () => {
        if(!showArtists) {
            setArtistsClick(true);
            setAlbumsClick(false);
            setPlaylistsClick(false);
            setSongsClick(false);
            setShowArtists(true);
            setShowAlbums(false);
            setShowSongs(false);
            setShowPlaylists(false);
        }
        //change for other elements
    }

    const handleAlbumsClick = () => {
        if(!showAlbums) {
            setShowAlbums(true);
            setShowArtists(false);
            setShowSongs(false);
            setShowPlaylists(false);

            setArtistsClick(false);
            setAlbumsClick(true);
            setPlaylistsClick(false);
            setSongsClick(false);
        }
        //change for other elements
    }

    const handleSongsClick = () => {
        if(!showSongs) {
            setShowSongs(true);
            setShowArtists(false);
            setShowAlbums(false);
            setShowPlaylists(false);
            
            setSongsClick(true);
            setArtistsClick(false);
            setAlbumsClick(false);
            setPlaylistsClick(false);
        }
        //change for other elements
    }

    const handlePlaylistsClick = () => {
        if(!showPlaylists) {
            setShowPlaylists(true);
            setShowArtists(false);
            setShowSongs(false);
            setShowAlbums(false);

            setArtistsClick(false);
            setAlbumsClick(false);
            setPlaylistsClick(true);
            setSongsClick(false);
        }
        //change for other elements
    }

  return (
    <div className='menu-container'>
        <div className = "button-group">
            <button className={artistsClick ? "artist-click" : "menu-button-left"} onClick={handleArtistsClick}> Artists </button>
            <button className={albumsClick ? "middle-click" : "menu-button"} onClick={handleAlbumsClick}> Albums </button>
            <button className={songsClick ? "middle-click" : "menu-button"} onClick={handleSongsClick}> Songs </button>
            <button className={playlistsClick ? "playlists-click" : "menu-button-right"} onClick={handlePlaylistsClick}> Playlists </button>
        </div>
        {showArtists && <ProfileArtists/>}
        {showAlbums && <ProfileAlbums/>}
        {showSongs && <ProfileSongs/>}
        {showPlaylists && <ProfilePlaylists/>}
    </div>
  );
}

export default ProfileMenu;
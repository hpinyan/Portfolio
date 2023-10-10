import React, {useState} from 'react';
import '../css/Search.css';
import HomeHeader from './HomeHeader';
import SearchMenu from './SearchMenu';
import 'bootstrap/dist/css/bootstrap.css';

function Search() {

  const [searchQuery, setSearchQuery] = useState('');
  const [searchClicked, setSearchClicked] = useState(false);
  const [searchKey, setSearchKey] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClick = () => {
      setSearchClicked(true);
      setSearchKey(searchQuery); // Update the searchKey state variable
  };

  return (
      <div>
          <HomeHeader/>
          <div className="search-container">
              <input
                  className='search-text'
                  type="text"
                  placeholder="Search artist, song, or album"
                  value={searchQuery}
                  onChange={handleSearch}
                  id="search-query"
              />
              <button
                  disabled={searchQuery.length===0}
                  className="search-button-search" onClick={handleClick}>Search</button>
          </div>
          {searchClicked && (
              <SearchMenu key={searchKey} /> // Add key prop to SearchMenu component
          )}
      </div> 
  );
}

export default Search;

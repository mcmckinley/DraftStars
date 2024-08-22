// MapSelector.js
// Credit: https://plainenglish.io/blog/how-to-implement-a-search-bar-in-react-js

import React, { useState, useEffect, useRef } from 'react'
import { maps } from './mapData'
import MapSearchResult from './MapSearchResult';


const MapSelector = ({ selectedMap, setMap, moveToNextSection=()=>{} }) => {
  var rankedMaps = maps.filter(map => map.isInRanked == 'true');

  // State for the search query and filtered results
  const [query, setQuery] = useState('');
  const [filteredMaps, setFilteredMaps] = useState(rankedMaps);
  // Focus state of the text box
  const [isFocused, setIsFocused] = useState(false);
  // used to deselect the text box once one search result is valid
  const inputRef = useRef(null);

  // Function to handle the search logic
  const handleSearch = (event) => {
    const value = event.target.value;
    setQuery(value);

    // Filter the maps based on the search query
    const filtered = rankedMaps.filter(map =>
      map.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMaps(filtered);
  };

  // Automatically select when the search results yield a single map
  useEffect(() => {
    if (filteredMaps.length === 1) {
      setMap(filteredMaps[0].id);
      console.log('Map:', filteredMaps[0].id)
      moveToNextSection()

      // setIsFocused(false)
      if (inputRef.current) {
        inputRef.current.blur(); // Deselect the text box
      }
    }
  }, [filteredMaps, setMap]);

  return (
    <div>
      <input
        className="search-bar"
        type="text"
        placeholder="Enter map name..."
        value={query}
        onChange={handleSearch}
        // onFocus={() => setIsFocused(true)}
        // onBlur={() => setTimeout(() => setIsFocused(false), 100)}
        ref={inputRef}
      />
      {/* Search results that display only while the search bar has been selected */}
      <div className="map-search-result-box">
        {filteredMaps.map((map, index) => (
          <MapSearchResult 
            key={index} 
            map={map} 
            setMap={setMap} 
            isSelected={selectedMap == map.id} 
            moveToNextSection={moveToNextSection}
          />
        ))}
      </div>
    </div>
  );
};

export default MapSelector;
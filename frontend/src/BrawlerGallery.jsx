// src/BrawlerGallery.jsx

import React, { useState, useEffect, useRef } from 'react';
import { brawlers } from './data';  // Import the variable
import icons from './iconLoader';

// import BrawlerGalleryItem from './BrawlerGalleryItem'

const BrawlerGallery = ({setSelectedBoxID, selectedBoxID, entries, setEntries, closeBrawlerSection, banMode=false, rankedMode=false, teamWithFirstPick=null}) => {
  // State for the search query and filtered results
  const [query, setQuery] = useState('');
  const [filteredBrawlers, setFilteredBrawlers] = useState(brawlers);
  // Focus state of the text box
  const [isFocused, setIsFocused] = useState(false);
  // used to deselect the text box once one search result is valid
  const inputRef = useRef(null);

  // Function to handle the search logic
  const handleSearch = (event) => {
    const value = event.target.value;
    setQuery(value);

    // Filter the brawlers based on the search query
    const filtered = brawlers.filter(brawler =>
      brawler.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBrawlers(filtered);
  };

  // Update the brawler ID, which updates the entry box
  // index: the ID of the brawler to be selected
  const updateEntries = (newIndex) => {
    // Ban mode
    if (banMode) {
      const newBans = [...entries]
      newBans.push(newIndex)
      setEntries(newBans)
    }
    // Normal mode
    else {
      const newEntries = [...entries]
      newEntries[selectedBoxID] = newIndex
      setEntries(newEntries)
    }
  }

  // returns the ID of the next empty entry box. If none found, return false.
  const getIDofNextEmptyEntryBox = () => {
    var index = selectedBoxID
    var end = selectedBoxID == 0 ? 5 : selectedBoxID - 1 
    while (index != end) {
      index++
      if (index > 5) 
        index = 0
      if (entries[index] == '') {
        return index
      } 
    }
    return 'none'
  }

  // Update when a brawler is selected
  const selectBrawler = (brawler) => {
    console.log('Selecting brawler:', brawler.name)
    if (banMode) {
      updateEntries(brawler.id)
      setQuery('')
      setFilteredBrawlers(brawlers)
    } else if (selectedBoxID != null) {
      updateEntries(brawler.id)

      // Automatically select the next empty box, so the user doesn't have to manually click each one.
      
      const nextEmptyBox = getIDofNextEmptyEntryBox()
      if (nextEmptyBox == 'none'){
        setSelectedBoxID(null)
        closeBrawlerSection()
      } else {
        setSelectedBoxID(nextEmptyBox)
      }

      // setIsFocused(false)           // unselect the text input
      setQuery('')                  // clear the text input
      setFilteredBrawlers(brawlers) // reset the brawlers array
    }
  }

  // Automatically select when the search results yield a single brawler
  useEffect(() => {
    if (filteredBrawlers.length === 1) {
      selectBrawler(filteredBrawlers[0]);
    }
  }, [filteredBrawlers, /* selectBrawler */]);


  const BrawlerGalleryItem = ({ brawler }) => {
    return ( 
      <div className="gallery-item" onClick={() => {console.log('brawler:', brawler.name); selectBrawler(brawler)}}>
        <img src={icons[brawler.imgUrl]} className={brawler.name}></img>
      </div> 
    )
  }

  return (
    <div className="brawler-gallery">
      <input
        type="text"
        className="search-bar"
        placeholder="Enter brawler name..."
        value={query}
        onChange={handleSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 100)}
        ref={inputRef}
      />
      <div className="brawler-gallery-search-results">
        {filteredBrawlers.map((brawler) => (
          <BrawlerGalleryItem 
            key={brawler.id}
            brawler={brawler} 
          />
        ))}
      </div>
    </div>
    
  );
};

export default BrawlerGallery;
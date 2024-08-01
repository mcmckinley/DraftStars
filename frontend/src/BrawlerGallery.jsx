// src/BrawlerGallery.jsx

import React, { useState, useEffect, useRef } from 'react';
import { brawlers } from './data';  // Import the variable
import icons from './iconLoader';

// import BrawlerGalleryItem from './BrawlerGalleryItem'

const BrawlerGallery = ({
    setSelectedBoxID, selectedBoxID, 
    entries, setEntries, 
    closeBrawlerSection, 
    banMode=false, 
    rankedMode=false, 
    teamWithFirstPick, 
    rankedModeSelectionIndex,
    setRankedModeSelectionIndex
  }) => {
  // State for the search query and filtered results
  const [query, setQuery] = useState('');
  const [filteredBrawlers, setFilteredBrawlers] = useState(brawlers);
  // Focus state of the text box
  const [isFocused, setIsFocused] = useState(false);
  // used to deselect the text box once one search result is valid
  const inputRef = useRef(null);

  // The index used for the below arrays.
  

  // The orders of in which players select their brawlers, based off of box IDs 
  const orderOfBoxSelection = (teamWithFirstPick == 'Blue' ? [0, 5, 4, 1, 2, 3] : [5, 0, 1, 4, 3, 2])

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

  const selectNextEntryBox = () => {
    // Ban mode does not use entry boxes.
    if (banMode) {
      return;
    } else if (rankedMode) {
      setRankedModeSelectionIndex(rankedModeSelectionIndex + 1);
    } 
     // In normal mode, just select the next empty entry box.
    else {
      const nextEmptyBox = getIDofNextEmptyEntryBox()
      if (nextEmptyBox == 'none'){
        setSelectedBoxID(null)
        closeBrawlerSection()
      } else {
        setSelectedBoxID(nextEmptyBox)
      }
    }
  }

  // Update when a brawler is selected
  const selectBrawler = (brawler) => {
    console.log('Selecting brawler:', brawler.name)
    updateEntries(brawler.id)
    selectNextEntryBox()
    setQuery('')                  
    setFilteredBrawlers(brawlers) 
  }

  // Automatically select when the search results yield a single brawler
  useEffect(() => {
    if (filteredBrawlers.length === 1) {
      selectBrawler(filteredBrawlers[0]);
    }

    if (rankedMode) {
      setSelectedBoxID(orderOfBoxSelection[rankedModeSelectionIndex])
    }

  }, [filteredBrawlers, rankedModeSelectionIndex]);


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
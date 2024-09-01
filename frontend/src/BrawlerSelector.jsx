// src/BrawlerSelector.jsx

import React, { useState, useEffect, useRef } from 'react';
import { brawlers } from './data';  // Import the variable
import icons from './iconLoader';
import BrawlerEntryBox from './BrawlerEntryBox';

const BrawlerSelector = ({
    setSelectedBoxID, selectedBoxID, 
    entries, setEntries, 
    closeBrawlerSection, 
    standardMode=false,
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

  // The orders of in which players select their brawlers, based off of box IDs 
  const orderOfBoxSelection = (teamWithFirstPick == 'Blue' ? [0, 5, 4, 1, 2, 3] : [5, 0, 1, 4, 3, 2])

  // Takes text from the search bar and updates filteredBrawlers 
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
  const updateEntries = (selectedBrawlerIndex) => {
    console.log('Selected ' + selectedBrawlerIndex)
    // Ban mode: push the brawler onto the array
    if (banMode) {
      // If an already banned brawler is selected, remove it
      if (entries.includes(selectedBrawlerIndex)){
        const newEntries = entries.filter(entry => entry != selectedBrawlerIndex);
        setEntries(newEntries); 
        return;
      }
      // No more than 6 bans
      if (entries.length > 5){
        return;
      }
      
      const newBans = [...entries]
      newBans.push(selectedBrawlerIndex)
      setEntries(newBans)
    }
    // Normal/Ranked: update the specific index of the array
    else {
      const newEntries = [...entries]
      newEntries[selectedBoxID] = selectedBrawlerIndex
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
    return 'not found'
  }

  const selectNextEntryBox = () => {
    // Ban mode does not use entry boxes.
    if (banMode) {
      return;
    } else if (rankedMode) {
      setRankedModeSelectionIndex(rankedModeSelectionIndex + 1)
    }
    // In normal mode, just select the next empty entry box.
    else {
      const nextEmptyBox = getIDofNextEmptyEntryBox()
      if (nextEmptyBox == 'not found'){
        setSelectedBoxID(null)
        closeBrawlerSection()
      } else {
        setSelectedBoxID(nextEmptyBox)
      }
    }
  }

  // Update when a brawler is selected
  const selectBrawler = (brawler) => {
    updateEntries(brawler.id)     // update the entries array
    selectNextEntryBox()          // select the next entry box
    setQuery('')                  // clear the textInput
    setFilteredBrawlers(brawlers) // reset the brawlers search
  }

  // Automatically select when the search results yield a single brawler
  useEffect(() => {
    if (filteredBrawlers.length === 1) {
      selectBrawler(filteredBrawlers[0]);
    }
    if (rankedMode) {
      setSelectedBoxID(orderOfBoxSelection[rankedModeSelectionIndex])
    }
  }, [filteredBrawlers]);


  const BrawlerSelectorItem = ({ brawler }) => {
    var isBanned = banMode && entries.includes(brawler.id)

    return ( 
      <div className={"gallery-item" + (isBanned ? ' red-tint' : '')} onClick={() => {selectBrawler(brawler)}}>
        <img src={icons[brawler.imgUrl]} alt={brawler.name} className={brawler.name}></img>
      </div> 
    )
  }

  return (
    <>
      { banMode == false && 
      (<div className='teams'>
        <div className="team-div blue-team">
          <BrawlerEntryBox index={0} selectedBoxID={selectedBoxID} setSelectedBoxID={setSelectedBoxID} entries={entries} setEntries={setEntries}/>
          <BrawlerEntryBox index={1} selectedBoxID={selectedBoxID} setSelectedBoxID={setSelectedBoxID} entries={entries} setEntries={setEntries}/>
          <BrawlerEntryBox index={2} selectedBoxID={selectedBoxID} setSelectedBoxID={setSelectedBoxID} entries={entries} setEntries={setEntries}/>
        </div>

        <div className="team-div red-team">
          <BrawlerEntryBox index={3} selectedBoxID={selectedBoxID} setSelectedBoxID={setSelectedBoxID} entries={entries} setEntries={setEntries}/>
          <BrawlerEntryBox index={4} selectedBoxID={selectedBoxID} setSelectedBoxID={setSelectedBoxID} entries={entries} setEntries={setEntries}/>
          <BrawlerEntryBox index={5} selectedBoxID={selectedBoxID} setSelectedBoxID={setSelectedBoxID} entries={entries} setEntries={setEntries}/>
        </div>
      </div>)}

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
            <BrawlerSelectorItem 
              key={brawler.id}
              brawler={brawler} 
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default BrawlerSelector;
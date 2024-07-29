// src/EntryBox.jsx

import React, { useState } from 'react';
import { brawlers } from './data';  // Import the variable
import icons from './iconLoader';

// index: a unique number assigned to the box. this lets the box know whether it is currently selected.
// (set)selectedBoxId: the index of the box currently selected
// (set)brawler: the brawler ID assigned to the box

const BrawlerEntryBox = ({ index, selectedBoxID, setSelectedBoxID, entries, setEntries}) => {

  // Select / unselect when box is clicked
  const handleClick = () => {
    if (selectedBoxID == index){
      setSelectedBoxID(null)
    } else {
      setSelectedBoxID(index);
    }
  }

  // Update the entry box when the input is changed
  const updateEntryBox = (newIndex) => {
    const newEntries = [...entries]
    newEntries[selectedBoxID] = newIndex
    setEntries(newEntries)
  }

  var brawlerID = entries[index]
  // If the input is invalid or doesn't yet exist, put a question mark
  var iconUrl = 'ranked-icon.png';
  if (brawlerID){
    iconUrl = brawlers[brawlerID].imgUrl
  }
  var icon = icons[iconUrl]

  
  return (
    <div className={`entry-box ${(selectedBoxID === index ? 'selected' : 'unselected')}`} onClick={handleClick}>
      <img src={icon}></img>
      {/* <input 
        className = "temp-input-box" 
        type="number" 
        value={entries[index]} 
        onChange={(e) => updateEntryBox(parseFloat(e.target.value))} 
        min="0"
        max={brawlers.length}
      /> */}
    </div>
  )
}

export default BrawlerEntryBox;

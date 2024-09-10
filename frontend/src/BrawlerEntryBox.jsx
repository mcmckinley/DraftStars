// src/EntryBox.jsx

import React, { useState } from 'react';
import { brawlers } from './data/brawlers';  // Import the variable
import brawlerIcons from './utils/iconLoader';

// index: a unique number assigned to the box. this lets the box know whether it is currently selected.
// (set)selectedBoxId: the index of the box currently selected
// (set)brawler: the brawler ID assigned to the box

const BrawlerEntryBox = ({ index, selectedBoxID, setSelectedBoxID, entries, isSelectable }) => {

  // Select / unselect when box is clicked
  const handleClick = () => {
    if (!isSelectable)
      return
    if (selectedBoxID == index){
      setSelectedBoxID(null)
    } else {
      setSelectedBoxID(index);
    }
  }
  
  const brawlerID = entries[index]
  
  return (
    <div className={`entry-box ${(selectedBoxID === index ? 'selected' : 'unselected')} ${isSelectable ? 'selectable-entry-box' : ''}`} onClick={handleClick}>
      <img src={brawlerID ? brawlerIcons[brawlers[brawlerID].imgUrl] : brawlerIcons['ranked-icon.png']} 
        alt={brawlerID ? brawlers[brawlerID].name : '?'}
      ></img>
    </div>
  )
}

export default BrawlerEntryBox;

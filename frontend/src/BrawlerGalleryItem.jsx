// src/BrawlerGalleryItem.jsx

import React, { useState } from 'react';
import icons from './iconLoader';

const GalleryItem = ({brawler, selectedBoxID, setSelectedBoxID, entries, setEntries, getIDofNextEmptyEntryBox}) => {

  const updateEntryBox = (newIndex) => {
    const newEntries = [...entries]
    newEntries[selectedBoxID] = newIndex
    setEntries(newEntries)
  }

  const handleSelection = () => {
    if (selectedBoxID != null) {
      updateEntryBox(brawler.id)  
      setSelectedBoxID(getIDofNextEmptyEntryBox())
    }
  }

  return ( 
    <div key={"gallery-item-"+brawler.name} className="gallery-item" onClick={handleSelection}>
      <img src={icons[brawler.imgUrl]} className={brawler.name} key={"gallery-item-"+brawler+"-img"}></img>
    </div> 
  )
}

export default GalleryItem;
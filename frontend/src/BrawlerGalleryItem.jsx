// src/BrawlerGalleryItem.jsx

import React, { useState } from 'react';
import icons from './iconLoader';

const GalleryItem = ({brawler, selectedBoxID, setSelectedBoxID, entries, setEntries, getIDofNextEmptyEntryBox, closeBrawlerSection}) => {

  const updateEntryBox = (newIndex) => {
    const newEntries = [...entries]
    newEntries[selectedBoxID] = newIndex
    setEntries(newEntries)
  }

  const handleSelection = () => {
    if (selectedBoxID != null) {
      updateEntryBox(brawler.id)  

      const nextEmptyBox = getIDofNextEmptyEntryBox()
      if (nextEmptyBox == 'none'){
        setSelectedBoxID(null)
        closeBrawlerSection()
      } else {
        setSelectedBoxID(nextEmptyBox)
      }
    }
  }

  return ( 
    <div key={"gallery-item-"+brawler.name} className="gallery-item" onClick={handleSelection}>
      <img src={icons[brawler.imgUrl]} className={brawler.name} key={"gallery-item-"+brawler+"-img"}></img>
    </div> 
  )
}

export default GalleryItem;
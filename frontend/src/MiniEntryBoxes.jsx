// src/MiniEntryBoxes.jsx

import React, { useState } from 'react';
import { brawlers } from './data.js'
import icons from './iconLoader';

const MiniEntryBoxes = ({ entries }) => {
  return ( 
    // OK, this is ugly, I get it. How do I refactor this? I'm having 
    // trouble making map() make sense in this scenario. 
    <div className="mini-entry-boxes">
      <div className="left">
        <div className="mini-entry-box">
            <img src={(entries[0] == '') ? icons['ranked-icon'] : icons[brawlers[Number(entries[0])].imgUrl]}></img>
        </div>
        <div className="mini-entry-box">
            <img src={(entries[1] == '') ? icons['ranked-icon'] : icons[brawlers[Number(entries[1])].imgUrl]}></img>
        </div>
        <div className="mini-entry-box">
            <img src={(entries[2] == '') ? icons['ranked-icon'] : icons[brawlers[Number(entries[2])].imgUrl]}></img>
        </div>
      </div>

      <div className="right">
        <div className="mini-entry-box">
            <img src={(entries[3] == '') ? icons['ranked-icon'] : icons[brawlers[Number(entries[3])].imgUrl]}></img>
        </div>
        <div className="mini-entry-box">
            <img src={(entries[4] == '') ? icons['ranked-icon'] : icons[brawlers[Number(entries[4])].imgUrl]}></img>
        </div>
        <div className="mini-entry-box">
            <img src={(entries[5] == '') ? icons['ranked-icon'] : icons[brawlers[Number(entries[5])].imgUrl]}></img>
        </div>
      </div>
    </div> 
  )
}

export default MiniEntryBoxes;
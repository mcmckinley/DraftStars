// src/enginePage/SelectTeamWithFirstPick.jsx

import React, { useState } from 'react'
import brawlerIcons from '../utils/iconLoader'

// The thumbs up buttons to select which team has first pick
const SelectTeamWithFirstPick = ({ teamWithFirstPick, setTeamWithFirstPick, moveToNextSection }) => {
    return (
      <>
        <div className={`thumb-div ${teamWithFirstPick == 'blue' ? 'selected-thumb':'unselected-thumb'}`} 
          onClick={ () => {
            setTeamWithFirstPick('Blue'); 
            moveToNextSection()
          }}>
          <img src={brawlerIcons['thumbs-up.png']} alt='thumbs up'  />
          <p>Your team</p>
        </div>

        <div className={`thumb-div ${teamWithFirstPick == 'red' ? 'selected-thumb':'unselected-thumb'}`} 
          onClick={ () => {
            setTeamWithFirstPick('Red'); 
            moveToNextSection()
          }}>
          <img src={brawlerIcons['thumbs-down.png']} alt='thumbs down' />
          <p>Enemy team</p>
        </div>
      </>
    )
}

export default SelectTeamWithFirstPick
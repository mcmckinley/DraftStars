import React, { useState } from 'react'
import icons from './iconLoader'

// The thumbs up buttons to select which team has first pick
const SelectTeamWithFirstPick = ({ teamWithFirstPick, setTeamWithFirstPick, moveToNextSection }) => {
    return (
      <>
        <div className={`thumb-div ${teamWithFirstPick == 'blue' ? 'selected-thumb':'unselected-thumb'}`} 
          onClick={ () => {
            setTeamWithFirstPick('blue'); 
            moveToNextSection()
          }}>
          <img src={icons['thumbs-up.png']}   />
          <p>Your team</p>
        </div>

        <div className={`thumb-div ${teamWithFirstPick == 'red' ? 'selected-thumb':'unselected-thumb'}`} 
          onClick={ () => {
            setTeamWithFirstPick('red'); 
            moveToNextSection()
          }}>
          <img src={icons['thumbs-down.png']}   />
          <p>Enemy team</p>
        </div>
      </>
    )
}

export default SelectTeamWithFirstPick
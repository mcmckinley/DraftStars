import React, { useState } from 'react'
import mapIcons from '../utils/mapLoader';

const gameModeColors = ['#9430C1', '#95B0E4', '#FFBD33', '#33B8DF', '#BF86C6', '#E22525', '#2be6ff']


const MapSearchResult = ({ index, map, setMap, isSelected, moveToNextSection}) => {
    return (
        <div 
            onClick={() => {
                setMap(map.id); 
                moveToNextSection()
            }} 
            className={'map-search-result' + (isSelected ? '' : '')}
            // style = {{backgroundColor: gameModeColors[map.game_mode]}}
        >
            <p key={index} className="no-text-select" >{map.name}</p>
            <img src={mapIcons[map.imgUrl]}></img>
        </div>
    )
}

export default MapSearchResult;

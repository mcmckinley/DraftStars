import React, { useState } from 'react'
import mapImages from './mapLoader';

const gameModeColors = ['#9430C1', '#95B0E4', '#FFBD33', '#33B8DF', '#BF86C6', '#E22525']


const MapSearchResult = ({ index, map, setMap, isSelected, closeMapSearchBar}) => {
    return (
        <div 
            onClick={() => {setMap(map.id); closeMapSearchBar()}} 
            className={'map-search-result' + (isSelected ? '' : '')}
            // style = {{backgroundColor: gameModeColors[map.game_mode]}}
        >
            <p key={index} className="unselectable">{map.name}</p>
            <img src={mapImages[map.imgUrl]}></img>
        </div>
    )
}

export default MapSearchResult;

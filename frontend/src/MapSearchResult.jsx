import React, { useState } from 'react'
import mapImages from './mapLoader';

const MapSearchResult = ({ index, map, setMap}) => {
    return (
        <div className="map-search-result">
            <p key={index} onClick={() => setMap(map.id)}>{map.name}</p>
            <img src={mapImages[map.imgUrl]}></img>
        </div>
    )
}

export default MapSearchResult;

// frontend/src/App.jsx

import React, { useState } from 'react';
import { brawlers } from './data';  // Import the variable
import { maps } from './mapData'
import BrawlerEntryBox from './BrawlerEntryBox';
import BrawlerGallery from './BrawlerGallery';
import BrawlerGalleryItem from './BrawlerGalleryItem';
import icons from './iconLoader';
import mapImages from './mapLoader';
import MapSearchBar from './MapSearchBar'

// Up chevron
import { FaChevronUp, FaChevronRight } from 'react-icons/fa';

const App = () => {
  // The values for each entry box
  //const [entries, setEntries] = useState(['1', '11', '35', '77', '75', '73'])
  const [entries, setEntries] = useState(['', '', '', '', '', ''])

  const [selectedBoxID, setSelectedBoxID] = useState(null)

  const [map, setMap] = useState(0)

  const [result, setResult] = useState(null)

  const [isShowingMapSection, setMapSectionVisibility] = useState(true)

  const gameModes = ['Gem Grab', 'Brawl Ball', 'Knockout', 'Wipeout', 'Heist']

  const getPrediction = async () => {
    try {
      const blue1 = parseInt(entries[0], 10);
      const blue2 = parseInt(entries[1], 10);
      const blue3 = parseInt(entries[2], 10);
      const red1 = parseInt(entries[3], 10);
      const red2 = parseInt(entries[4], 10);
      const red3 = parseInt(entries[5], 10);

      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blue1, blue2, blue3, red1, red2, red3, map }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResult(data.result);
      console.log('Got result:', data.result)

      // display an error if we can't connect to server
    } catch (error) {
      setResult('Error');
    }
  };

  return (
    <div className="main">
      <div className="map-section">
        <div className="map-select-div-upper">
            
          <div className="map-select-div-upper">
            <button className={"toggle-map-section-visibility-button-" + (isShowingMapSection ? 'showing' : 'hidden')} onClick={() => setMapSectionVisibility(!isShowingMapSection)}>
              {isShowingMapSection ? (
                <FaChevronUp />
              ) : (
                <FaChevronRight />
              )}
            </button>
            <p>Map</p>
          </div>

          {isShowingMapSection ? (
            <h2>{maps[map].name}</h2>
          ) : (
            <p>{gameModes[maps[map].game_mode] + ' - ' + maps[map].name}</p>
          )}

          {isShowingMapSection && (
            <img src={mapImages[maps[map].imgUrl]}></img>
          )}

        </div>

        {/* Search bar */}
        <div className="map-select-div-lower">
          {isShowingMapSection && (<MapSearchBar setMap={setMap}/>)} 
        </div>

      </div>



      <div className="teams">

        <div className="team-div blue-team">
          <BrawlerEntryBox index={0} selectedBoxID={selectedBoxID} setSelectedBoxID={setSelectedBoxID} entries={entries} setEntries={setEntries}/>
          <BrawlerEntryBox index={1} selectedBoxID={selectedBoxID} setSelectedBoxID={setSelectedBoxID} entries={entries} setEntries={setEntries}/>
          <BrawlerEntryBox index={2} selectedBoxID={selectedBoxID} setSelectedBoxID={setSelectedBoxID} entries={entries} setEntries={setEntries}/>
        </div>

        <div className="team-div red-team">
          <BrawlerEntryBox index={3} selectedBoxID={selectedBoxID} setSelectedBoxID={setSelectedBoxID} entries={entries} setEntries={setEntries}/>
          <BrawlerEntryBox index={4} selectedBoxID={selectedBoxID} setSelectedBoxID={setSelectedBoxID} entries={entries} setEntries={setEntries}/>
          <BrawlerEntryBox index={5} selectedBoxID={selectedBoxID} setSelectedBoxID={setSelectedBoxID} entries={entries} setEntries={setEntries}/>
        </div>
      </div>

      <div className="middle">
        {/* Pass selectedBoxId so that the user can select brawlers using the gallery */}
        <BrawlerGallery selectedBoxID={selectedBoxID} setSelectedBoxID={setSelectedBoxID} entries={entries} setEntries={setEntries}/>

        <button onClick={getPrediction}></button>

        <h1>{'Prediction: ' + result}</h1>

      </div>

    </div>
  );
};

export default App;

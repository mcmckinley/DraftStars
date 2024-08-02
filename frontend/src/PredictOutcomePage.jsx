// frontend/src/PredictOutcomePage.jsx

import React, { useState, useEffect } from 'react';
import { brawlers } from './data';
import { maps } from './mapData'
import BrawlerEntryBox from './BrawlerEntryBox';
import BrawlerSelector from './BrawlerSelector';
import icons from './iconLoader';
import mapImages from './mapLoader';
import MapSearchBar from './MapSearchBar'
import MiniEntryBoxes from './MiniEntryBoxes'
import PredictionDescription from './PredictionDescription';

// chevrons
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const PredictOutcomePage = () => {
  // The values for each entry box
  // const [entries, setEntries] = useState(['1', '11', '35', '77', '75', '73'])
  const [entries, setEntries] = useState(['', '', '', '', '', ''])
  const [previousEntries, setPreviousEntries] = useState(['', '', '', '', '', ''])
  const anyEntriesEmpty = () => {
    return entries.some(entry => entry === '');
  };

  const [selectedBoxID, setSelectedBoxID] = useState(0)

  const [map, setMap] = useState(0)
  const [previousMap, setPreviousMap] = useState(0)

  const [result, setResult] = useState(0.5)

  const [isShowingMapSection, setMapSectionVisibility] = useState(true)

  const gameModes      = ['Gem Grab', 'Brawl Ball', 'Knockout', 'Wipeout', 'Heist', 'Hot Zone']
  const gameModeColors = ['#9430C1', '#95B0E4', '#FFBD33', '#33B8DF', '#BF86C6', '#E22525']

  const [isAwaitingPrediction, setIsAwaitingPrediction] = useState(false)

  const getPrediction = async () => {
    try {
      setIsAwaitingPrediction(true)
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
      setResult(data.result[0]);
      setIsAwaitingPrediction(false)
      setPreviousEntries(entries)
      setPreviousMap(map)
      console.log('Got result:', result)

      // display an error if we can't connect to server
    } catch (error) {
      console.error(error)
      setResult('error');
    }
  };

  // Runs when the element loads
  useEffect(() => {
    const shouldGetPredition = !anyEntriesEmpty() && (previousEntries != entries || previousMap != map)
    if (shouldGetPredition) {
      console.log('Will get prediciton')
      console.log('previous entries:', previousEntries)
      console.log('entries:', entries)
      getPrediction()
    } else {
      console.log('should not get prediction')
    }
  }, [entries, map]); // Runs whenever these change

  return (
    <div className="input-page">
        {/* Map section */}
        <div className="section">
            <div className="section-upper-part">
            <div className="section-upper-part-left"> {/* this just works? */}
                <p>Select Map</p>
            </div>
            <div
                className="section-upper-part-right" 
                onClick={() => setMapSectionVisibility(!isShowingMapSection)}>
                {isShowingMapSection ? (
                    <FaChevronUp color="#bbb"/>
                ) : (
                    <FaChevronDown color="#bbb"/>
                )}
                <p className="unselectable">{gameModes[maps[map].game_mode] + ' - ' + maps[map].name}</p>
            </div>
            </div>

            { isShowingMapSection && (
            <div className="section-lower-part">
                <MapSearchBar 
                selectedMap={map} 
                setMap={setMap}
                closeMapSearchBar={()=>setMapSectionVisibility(false)}
                />
            </div>
            )}

        </div>

        {/* Select Brawler section */}
        <div className="section">
            <div className="section-upper-part">
            <div className="section-upper-part-left">
                <p>Select Brawlers</p>
            </div>
            <div className="section-upper-part-right">
            </div>
            </div>
            
            
            <div className="section-lower-part">  
                <>
                <div className='teams'>
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
                <>
                    {( selectedBoxID != null && 
                    <BrawlerSelector 
                        selectedBoxID={selectedBoxID} 
                        setSelectedBoxID={setSelectedBoxID} 
                        entries={entries} 
                        setEntries={setEntries}
                        closeBrawlerSection={()=>{
                        // setBrawlerSectionVisibility(false)
                        }}
                    />)}
                </>
                </>
            </div>
        </div>

        {/* Prediction bar */}
        <div className="section">
            <div className="section-lower-part">  
            <div className="prediction-bar">
                <div className="red-prediction-bar"></div>
                <div className="blue-prediction-bar" style={{width: result*100+'%', transition: 'width 0.3s',}}></div>
            </div>

            <div className="prediction-values">
                {result != null ? (
                <>
                    <p>{Math.round(result * 100) / 100}</p>
                    <p>{Math.round((1-result) * 100) / 100}</p>
                </>
                ) : (
                <p>Error: Could not connect to server.</p>
                )}
            </div>
            </div>
        </div> 

        {/*  */}
        <div className="section">
            <div className="section-upper-part">
            <div className="section-upper-part-left">
                <p>Prediction</p>
            </div>
            <div className="section-upper-part-right">
            </div>
            </div>

            <div className="section-lower-part">
            <PredictionDescription isAwaitingPrediction={isAwaitingPrediction} result={result}/>
            </div>

        </div>
    </div> 
  );
};

export default PredictOutcomePage;
// src/RankedRecommendationDisplay.jsx

import React, { useState, useEffect, useRef } from 'react';
import { brawlers } from './data';  // Import the variable
import icons from './iconLoader';
import BrawlerEntryBox from './BrawlerEntryBox';
import getRankedRecommendations from './getRankedRecommendations';

const RankedRecommendationDisplay = ({
    setSelectedBoxID, selectedBoxID, 
    entries, setEntries, 
    bans,
    map,
    teamWithFirstPick, 
    rankedModeSelectionIndex,
    setRankedModeSelectionIndex,
    isBlueTeamTurn,
    isFirstTimeLoadingSection3, setIsFirstTimeLoadingSection3 // If this is true, RankedRecommendationDisplay will send a request.
  }) => {
  // State for the search query and filtered results
  const [query, setQuery] = useState('');
  const [filteredBrawlers, setFilteredBrawlers] = useState(brawlers);
  // Focus state of the text box
  const [isFocused, setIsFocused] = useState(false);
  // used to deselect the text box once one search result is valid
  const inputRef = useRef(null);

  // The orders of in which players select their brawlers, based off of box IDs 
  const orderOfBoxSelection = (teamWithFirstPick == 'Blue' ? [0, 5, 4, 1, 2, 3] : [5, 0, 1, 4, 3, 2])

  const [predictions, setPredictions] = useState([
    {'score': 0.6, 'recommendation': 1, 'counter': 2, 'response': 3},
    {'score': 0.3, 'recommendation': 5, 'counter': 6, 'response': 7}
  ])

  // If this is the first time the element is loaded, get the ranked recommendations
  useEffect(() => {
    if (isFirstTimeLoadingSection3) {
      const predictions = getRankedRecommendations(entries, bans, map, teamWithFirstPick)
      setPredictions(predictions)
      setIsFirstTimeLoadingSection3(false)
    }
  }, [])

  // Takes text from the search bar and updates filteredBrawlers 
  const handleSearch = (event) => {
    const value = event.target.value;
    setQuery(value);

    // Filter the brawlers based on the search query
    const filtered = brawlers.filter(brawler =>
      brawler.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBrawlers(filtered);
  };

  // Update the brawler ID, which updates the entry box
  // index: the ID of the brawler to be selected
  const updateEntries = (newIndex) => {
    const newEntries = [...entries]
    newEntries[selectedBoxID] = newIndex
    setEntries(newEntries)
  }

  const selectNextEntryBox = () => {
    setRankedModeSelectionIndex(rankedModeSelectionIndex + 1)
  }

  // Update when a brawler is selected
  const selectBrawler = (brawler) => {
    updateEntries(brawler.id)     // update the entries array
    selectNextEntryBox()          // select the next entry box
    setQuery('')                  // clear the textInput
    setFilteredBrawlers(brawlers) // reset the brawlers search
    const predicitons = getRankedRecommendations(entries, bans, map, teamWithFirstPick, setPredictions)
    setPredictions(predicitons)
  }


  // Search bar useEffect
  useEffect(() => {
    if (filteredBrawlers.length === 1) {
      selectBrawler(filteredBrawlers[0]);
    }
    setSelectedBoxID(orderOfBoxSelection[rankedModeSelectionIndex])

  }, [filteredBrawlers]);

  // Displays the result of a single prediction.
  // This includes: 
  //  recommended brawler
  //  bar that shows the strength of the brawler
  //  possible next pick

  const RankedPredictionBar = ({ prediction }) => {
    // console.log(prediction)
    const recommendation = prediction['recommendation']
    const counter = prediction['counter']
    const response = prediction['response']
    const score = prediction['score']
    const synergy_pick = prediction['synergy_pick']

    const isFourthPick = rankedModeSelectionIndex == 3

    const recommendedBrawler = brawlers[recommendation]
    const recommendedBrawlerIcon = icons[recommendedBrawler.imgUrl]
    
    return ( 
      <div className="ranked-prediction-box" onClick={() => {console.log('clicked RPB')}}>
        <div className="prediction-box-left">
          <img src={recommendedBrawlerIcon} className='left-prediction-image'></img>
          {/* {isFourthPick && (<img src={icons[brawlers[synergy_pick].imgUrl]} className='recommended-brawler'></img>)} */}
        </div>

        <div className="confidence-box" style={{}}>
          <div className="confidence-bar" style={{
            width: `${score * 100}%`
          }}>
          </div>
        </div>

        <div className="prediction-box-right">
          <img src={icons[brawlers[counter].imgUrl]} className='right-prediction-image'></img>
        </div>
      </div>
    )
  }

  return (
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

      <input
          type="text"
          className="search-bar"
          placeholder="Enter brawler name..."
          value={query}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 100)}
          ref={inputRef}
        />

      <div className="brawler-gallery-search-results">
        {predictions.length === 0 ? (
          <p>Loading...</p>
        ) : (
          predictions.map(( prediction, index ) => (
            <RankedPredictionBar key={index} prediction={prediction}/>
          ))
        )}
      </div>
    </>
  );
};

export default RankedRecommendationDisplay;

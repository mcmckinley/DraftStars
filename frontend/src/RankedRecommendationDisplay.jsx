// src/RankedRecommendationDisplay.jsx

import React, { useState, useEffect, useRef } from 'react';
import { brawlers } from './data';  // Import the variable
import icons from './iconLoader';
import BrawlerEntryBox from './BrawlerEntryBox';

const RankedRecommendationDisplay = ({
    setSelectedBoxID, selectedBoxID, 
    entries, setEntries, 
    bans,
    map,
    teamWithFirstPick, 
    rankedModeSelectionIndex,
    setRankedModeSelectionIndex,
    isBlueTeamTurn
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

  const getRankedRecommendations = async () => {
    try {
      // indices 33 and 55 are unused by the Brawl Stars API, and
      // are not understood by the model. 
      // Increase any index above 33 by one, and any index above 55 by two.
      // Also, we repurpose index 33 to be used as a 'neutral' entry as a heuristic.
      var adjustedEntries = []
      for (var entry of entries) {
        if (entry == '') {
          adjustedEntries.push(33) 
        } else {
          adjustedEntry = parseInt(entry)
          if (adjustedEntry > 32) {
            adjustedEntry += 1
          } else if (adjustedEntry > 54) {
            adjustedEntry += 2
          }
        } 
      }

      const blue1 = adjustedEntries[0]
      const blue2 = adjustedEntries[1]
      const blue3 = adjustedEntries[2]
      const red1 = adjustedEntries[3]
      const red2 = adjustedEntries[4]
      const red3 = adjustedEntries[5]

      const blue_picks_first = teamWithFirstPick == "Blue" 

      const ban1 =  bans[0] ? parseInt(bans[0]) : null
      const ban2 =  bans[1] ? parseInt(bans[1]) : null
      const ban3 =  bans[2] ? parseInt(bans[2]) : null
      const ban4 =  bans[3] ? parseInt(bans[3]) : null
      const ban5 =  bans[4] ? parseInt(bans[4]) : null
      const ban6 =  bans[5] ? parseInt(bans[5]) : null

      const response = await fetch('http://localhost:8000/get_ranked_recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blue1, blue2, blue3, red1, red2, red3, map, blue_picks_first, ban1, ban2, ban3, ban4, ban5, ban6 }),
      });

      const data = await response.json();

      var result = data.result

      // Undo the operation preformed at the beginning of this function.
      for (var i = 0; i < result.length; i++) {
        if (result[i]['recommendation'] >= 55) {
          result[i]['recommendation'] -= 2
        } else if (result[i]['recommendation'] >= 33) {
          result[i]['recommendation'] -= 1
        }

        if (result[i]['counter'] && result[i]['counter'] >= 55) {
          result[i]['counter'] -= 2
        } else if (result[i]['counter'] >= 33) {
          result[i]['counter'] -= 1
        }

        if (result[i]['synergy_pick'] && result[i]['synergy_pick'] >= 55) {
          result[i]['synergy_pick'] -= 2
        } else if (result[i]['synergy_pick'] >= 33) {
          result[i]['synergy_pick'] -= 1
        }

        if (result[i]['response'] && result[i]['response'] >= 55) {
          result[i]['response'] -= 2
        } else if (result[i]['response'] >= 33) {
          result[i]['response'] -= 1
        }
      }

      for (var i = 0; i < 5; i++){
        console.log(`${i}: ${brawlers[result[i]['recommendation']].name} ${result[i]['score']}`)
      }

      setPredictions(result)
      
      // display an error if we can't connect to server
    } catch (error) {
      console.error(error)
    }
  };

  // Initial useEffect: API request
  useEffect(() => {
    getRankedRecommendations()
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
          <img src={recommendedBrawlerIcon} className='recommended-brawler'></img>
          {isFourthPick && (<img src={icons[brawlers[synergy_pick].imgUrl]} className='recommended-brawler'></img>)}
        </div>
        <div className="divider" style={{
            width: '3px', position: 'absolute', right: '50%', height: '40px', backgroundColor: 'white', zIndex: 2
        }}>

        <div className="prediction-bar" style={{width: '100%'}}>
          

          </div>
        </div>

        <div className="prediction-box-right">
          <img src={icons[brawlers[counter].imgUrl]} className='recommended-brawler'></img>
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
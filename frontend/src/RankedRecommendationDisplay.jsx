// src/RankedRecommendationDisplay.jsx

import React, { useState, useEffect, useRef  } from 'react';
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
    isFirstTimeLoadingSection3,
    previousEntries,
    previouslySelectedBox,
    error, setError
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

  const [predictions, setPredictions] = useState([])

  const [filteredPredictions, setFilteredPredictions] = useState([])

  const isBlueTeamTurn = orderOfBoxSelection[rankedModeSelectionIndex] < 3

  // Initial useEffect: API request
  useEffect(() => {
    // the second part of this condition KILLED me. I spent 3 hours this morning just for these 15 characters to solve my problem.
    if (isFirstTimeLoadingSection3.current && selectedBoxID != null) {
      getRankedRecommendations(entries, bans, map, teamWithFirstPick).then(result => {
        if (result['error']){
          setError(result['error'])
        } else {
          setPredictions(result)
          setFilteredPredictions(result)
        }
      })
      isFirstTimeLoadingSection3.current = false
    }

    if (selectedBoxID == null) {
      setSelectedBoxID(orderOfBoxSelection[rankedModeSelectionIndex])
    }

    // Send new request if both
    //  a) the user has selected a new brawler
    //  b) the DOM has updated
    if (previousEntries.current != entries && previouslySelectedBox.current != selectedBoxID){
      getRankedRecommendations(entries, bans, map, teamWithFirstPick).then(result => {
        if (result['error']){
          setError(result['error'])
        } else {
          setPredictions(result)
          setFilteredPredictions(result)
        }
      })

      previousEntries.current = entries
      previouslySelectedBox.current = selectedBoxID
    } else {
      // console.log('Did not update because either of these are equal')
      // console.log(previousEntries.current)
      // console.log(entries)
      // console.log(previouslySelectedBox)
      // console.log(selectedBoxID)
    }
  }, [])

  // Takes text from the search bar and updates filteredBrawlers 
  const handleSearch = (event) => {
    const value = event.target.value;
    setQuery(value);

    // Filter the brawlers based on the search query
    const filtered = predictions.filter(pred =>
      brawlers[pred['name']].name.toLowerCase().includes(value)
    );
    setFilteredPredictions(filtered);
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
    setSelectedBoxID(orderOfBoxSelection[rankedModeSelectionIndex + 1])
  }

  // Update when a brawler is selected
  const selectBrawler = (brawler) => {
    updateEntries(brawler.id)     // update the entries array
    selectNextEntryBox()          // select the next entry box
    setQuery('')                  // clear the textInput
    setFilteredPredictions(predictions) // reset the brawlers search
  }

  // useEffect(() => {
  //   if (filteredPredictions.length === 1) {
  //     selectBrawler(filteredBrawlers[0]);
  //   }
  // }, [filteredBrawlers]);

  // The header text for the list of recommendations. 
  const RankedPredictionBoxHeader = () => {
    var whoseTurnIsIt =   isBlueTeamTurn ? 'friendly' : 'enemy'
    var whoseTurnIsNext = isBlueTeamTurn ? 'enemy' : 'friendly'

    const isSecondPick = rankedModeSelectionIndex == 1
    const isFourthPick = rankedModeSelectionIndex == 3
    const isLastPick = rankedModeSelectionIndex == 5
    const pickingStageIsComplete = rankedModeSelectionIndex == 6

    if (pickingStageIsComplete) {
      whoseTurnIsIt = 'friendly'
    } else if (isSecondPick || isFourthPick) {
      whoseTurnIsNext = whoseTurnIsIt
    }
    return (
      <div className="ranked-prediction-box-header" onClick={() => {}}>
        {!pickingStageIsComplete && (
          <div className={"prediction-box-left " + whoseTurnIsIt}>
            <p>Brawler</p>
          </div>)
        }

        <div className={"confidence-header " + whoseTurnIsIt} style={{}}>
          <p>Score</p>
        </div>

        {/* Third column */}
        {/* Show the best counter or synergiy  */}
        {!isLastPick && !pickingStageIsComplete && (
          <>
            {isSecondPick || isFourthPick ? (
              <div className={"prediction-box-right " + whoseTurnIsIt}>
                <p>Best Synergy</p>
              </div>
            ) : (
              <div className={"prediction-box-right " + whoseTurnIsNext}>
                <p>Counter</p>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  // Colors that correspond to each brawler's rarity.
  const rarityColors = ['#76b2cc', '#198000', '#002cbd', '#7700b3', '#a10040', '#abc200']
  const brighterRarityColors = ['#8ecde8', '#25bd00', '#2457ff', '#b524ff', '#fc0064', '#ddf71b']

  // Once all the brawlers are entered, this shows who the model favors to win
  const isFinalPrediction = rankedModeSelectionIndex == 6

  const FinalPredictionBar = ({ prediction }) => {
    const score = prediction['score']

    return ( 
      <div className="ranked-prediction-box" >
        <div className="confidence-text">
          <p>{Math.round(score * 100) / 100}</p>
        </div>

        <div className="confidence-box" style={{}}>
          <div className={'friendly-confidence-bar'} style={{
            width: `${score * 100}%`
          }}>
          </div>
        </div>
      </div>
    )
  }

  // Displays the result of a single prediction.
  // This includes: 
  //  recommended brawler
  //  bar that shows the strength of the brawler
  //  possible next pick

  const RankedPredictionBar = ({ prediction, handleSelection }) => {
    const whoseTurnIsIt = isBlueTeamTurn ? "friendly" : "enemy"

    const [isHover, setIsHover] = useState(false);

    const handleMouseEnter = () => {
      setIsHover(true);
    };
    const handleMouseLeave = () => {
      setIsHover(false);
    };

    // console.log(prediction)
    const recommendation = prediction['name']
    const counter = prediction['counter']
    const response = prediction['response']
    const score = whoseTurnIsIt == 'friendly' ? prediction['score'] : 1 - prediction['score']
    const synergy_pick = prediction['synergy_pick']
    // console.log(prediction)
    // console.log(prediction['synergy_pick'])
    // console.log(synergy_pick)
    // console.log(brawlers[synergy_pick])


    if (prediction['reason']){
      return <IgnoredBrawlerBar prediction={prediction} handleSelection={handleSelection} />
    }

    const isSecondPick = rankedModeSelectionIndex == 1
    const isFourthPick = rankedModeSelectionIndex == 3
    const isLastPick = rankedModeSelectionIndex == 5

    const recommendedBrawler = brawlers[recommendation]
    const recommendedBrawlerIcon = icons[recommendedBrawler.imgUrl]

    // const rarityOfRecommendation = rarities[recommendedBrawler.rarity]
    const recommendedBrawlerBGColor = isHover ? brighterRarityColors[recommendedBrawler.rarity] : rarityColors[recommendedBrawler.rarity]

    return ( 
      <div className="ranked-prediction-box selectable-prediction-box"  
        onClick={handleSelection}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image of the recommended brawler */}
        <div className={"prediction-box-left"}
        style={{
          backgroundColor: recommendedBrawlerBGColor
        }}>
          <img src={recommendedBrawlerIcon} alt={recommendedBrawler.name} className='left-prediction-image'></img>
        </div>

        {/* Text that shows the score of the recommendation */}
        <div className="confidence-text">
          <p>{Math.round(score * 100) / 100}</p>
        </div>

        <div className="confidence-box" style={{}}>
          <div className={whoseTurnIsIt + '-confidence-bar'} style={{
            width: `${score * 100}%`
          }}>
          </div>
        </div>

        { !isLastPick && 
          (<div className="prediction-box-right">
            {/* If it's recommending a second pick or a fourth pick, the program shows a synergy pick option,
                rather than the opposing team's potential counter.*/}
            { isFourthPick || isSecondPick ? (
              <img src={icons[brawlers[synergy_pick].imgUrl]} alt={brawlers[synergy_pick].name} className='right-prediction-image'></img>
            ) : (
              <img src={icons[brawlers[counter].imgUrl]} alt={brawlers[counter].name} className='right-prediction-image'></img>
            )}
          </div>
        )}
      </div>
    )
  }

  // These are showns at the bottom of the list.
  // It shows which brawlers were not considered by the model, due to 
  //    - the backend's heuristical strategy
  //    - being banned
  //    - being picked
  const IgnoredBrawlerBar = ({ prediction, handleSelection }) => {
    const whoseTurnIsIt = isBlueTeamTurn ? "friendly" : "enemy"

    const [isHover, setIsHover] = useState(false);

    var handleMouseEnter = () => {
      setIsHover(true);
    };
    var handleMouseLeave = () => {
      setIsHover(false);
    };

    // console.log(prediction)
    const recommendation = prediction['name']
    const reasonForBeingIgnored = prediction['reason']

    const recommendedBrawler = brawlers[recommendation]
    const recommendedBrawlerIcon = icons[recommendedBrawler.imgUrl]

    // const rarityOfRecommendation = rarities[recommendedBrawler.rarity]
    const recommendedBrawlerBGColor = isHover ? brighterRarityColors[recommendedBrawler.rarity] : rarityColors[recommendedBrawler.rarity]

    const isBanned = reasonForBeingIgnored == 'BANNED'
    const isPicked = reasonForBeingIgnored == 'PICKED'
    const isNotConsidered = reasonForBeingIgnored == 'NOT CONSIDERED'

    // Banned and picked brawlers cannot be selected
    if (isBanned || isPicked) {
      handleSelection = () => {};
    }

    var tint = ''
    if (isBanned) {
      tint = 'dark-red-tint'
      handleMouseEnter = null
      handleMouseLeave = null
    } else if (isPicked) {
      tint = 'gray-tint'
      handleMouseEnter = null
      handleMouseLeave = null
    }

    var canSelect = !(isBanned || isPicked)

    return ( 
      <div className={"ranked-prediction-box " + tint + (canSelect ? ' selectable-prediction-box' : '')}
        onClick={handleSelection}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image of the recommended brawler */}
        <div className={"prediction-box-left"}
        style={{
          backgroundColor: recommendedBrawlerBGColor
        }}>
          <img src={recommendedBrawlerIcon} alt={recommendedBrawler.name} className={'left-prediction-image'}></img>
        </div>

        <div className={"confidence-box "}style={{}}>
          <p>{reasonForBeingIgnored}</p>
        </div>
      </div>
    )
  }

  const LoadingBar = () => {
    function getRandomImage() {
      const randomID = Math.floor(Math.random() * brawlers.length)
      return brawlers[randomID].imgUrl
    }

    const [currentImage, setCurrentImage] = useState(getRandomImage())

    useEffect(() => {
      const loop = setInterval(() => {
          setCurrentImage(getRandomImage());
      }, 2000);

      return () => clearInterval(loop);
    }, []);

    return ( 
      <div className="ranked-prediction-box">
        <div className={"prediction-box-left"}
        style={{
        }}>
          <img src={icons[currentImage]} className='left-prediction-image pulsing-brawler-headshot-fast'></img>
        </div>

        <div className={"confidence-box "}style={{}}>
          <p>AWAITING RESPONSE...</p>
        </div>
      </div>
    )
  }



  return (
    <>
      <div className='teams'>
        <div className="team-div blue-team">
          <BrawlerEntryBox index={0} selectedBoxID={selectedBoxID} setSelectedBoxID={setSelectedBoxID} entries={entries} setEntries={setEntries} isSelectable={false}/>
          <BrawlerEntryBox index={1} selectedBoxID={selectedBoxID} setSelectedBoxID={setSelectedBoxID} entries={entries} setEntries={setEntries} isSelectable={false}/>
          <BrawlerEntryBox index={2} selectedBoxID={selectedBoxID} setSelectedBoxID={setSelectedBoxID} entries={entries} setEntries={setEntries} isSelectable={false}/>
        </div>

        <div className="team-div red-team">
          <BrawlerEntryBox index={3} selectedBoxID={selectedBoxID} setSelectedBoxID={setSelectedBoxID} entries={entries} setEntries={setEntries} isSelectable={false}/>
          <BrawlerEntryBox index={4} selectedBoxID={selectedBoxID} setSelectedBoxID={setSelectedBoxID} entries={entries} setEntries={setEntries} isSelectable={false}/>
          <BrawlerEntryBox index={5} selectedBoxID={selectedBoxID} setSelectedBoxID={setSelectedBoxID} entries={entries} setEntries={setEntries} isSelectable={false}/>
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

      <div className={"brawler-gallery-search-results" + (error != null ? ' error' : '')}>
        { error ? (
          <p>An error occured.<br />{error}</p>
        ) : predictions.length == 0 ? (
          <LoadingBar />
        ) : filteredPredictions.length === 0 ? (
          <>
            <RankedPredictionBoxHeader />
            <p>No brawlers found</p>
          </>
        ) : isFinalPrediction ? (
          <>
            <RankedPredictionBoxHeader />
            <FinalPredictionBar prediction={predictions[0]} />
          </>
        ) : (
          <>
            <RankedPredictionBoxHeader />
            {filteredPredictions.map((prediction, index) => (
              <RankedPredictionBar 
                key={index} 
                prediction={prediction} 
                handleSelection={ ()=>{ 
                  selectBrawler(brawlers[prediction['name']])}
                }
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default RankedRecommendationDisplay;

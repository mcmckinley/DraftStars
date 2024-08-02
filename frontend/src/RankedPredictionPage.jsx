// frontend/src/RankedPredictionPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { brawlers } from './data';
import { maps } from './mapData'
import BrawlerEntryBox from './BrawlerEntryBox';
import BrawlerGallery from './BrawlerGallery';
import icons from './iconLoader';
import mapImages from './mapLoader';
import MapSearchBar from './MapSearchBar'
import PredictionDescription from './PredictionDescription';

// chevrons
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';

const RankedPredictionPage = () => {
  // The values for each entry box
  // const [entries, setEntries] = useState(['1', '11', '35', '77', '75', '73'])
  const [entries, setEntries] = useState(['', '', '', '', '', ''])
  const [previousEntries, setPreviousEntries] = useState(['', '', '', '', '', ''])
  const anyEntriesEmpty = () => {
    return entries.some(entry => entry === '');
  };

  const [teamWithFirstPick, setTeamWithFirstPick] = useState(null)
  const [userDraftNumber, setUserDraftNumber] = useState(null)

  const draftNumberStrings = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Last']

  const [rankedModeSelectionIndex, setRankedModeSelectionIndex] = useState(0)

  const [selectedBoxID, setSelectedBoxID] = useState(null)

  const [map, setMap] = useState(null)
  const [previousMap, setPreviousMap] = useState(0)

  const [result, setResult] = useState(0.5)

  const [isShowingMapSection, setMapSectionVisibility] = useState(false)
  function toggleMapSectionVisibility () {
    setMapSectionVisibility(!isShowingMapSection)
  }
  

  const gameModes      = ['Gem Grab', 'Brawl Ball', 'Knockout', 'Wipeout', 'Heist', 'Hot Zone']
  const gameModeColors = ['#9430C1', '#95B0E4', '#FFBD33', '#33B8DF', '#BF86C6', '#E22525']

  const [isAwaitingPrediction, setIsAwaitingPrediction] = useState(false)

  const [IDofActiveSection, setIDofActiveSection] = useState(0)
  const moveToNextSection = () => {
    setIDofActiveSection(IDofActiveSection + 1)
  }

  const [bans, setBans] = useState([])
  const removeBan = (indexToRemove) => {
    const newBans = bans.filter((ban, index) => index !== indexToRemove);
    setBans(newBans);
  };

  var entryGuides = [
    "Enter Blue's first pick",
    "Enter Red's first pick",
    "Enter Red's second pick",
    "Enter Blue's second pick",
    "Enter Blue's third pick",
    "Enter Red's last pick"
  ]

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

  const getRecommendations = async () => {
    try {
      // setIsAwaitingPrediction(true)
      const blue1 = entries[0] ? parseInt(entries[0], 10) : null;
      const blue2 = entries[1] ? parseInt(entries[1], 10) : null;
      const blue3 = entries[2] ? parseInt(entries[2], 10) : null;
      const red1 = entries[3] ? parseInt(entries[3], 10) : null;
      const red2 = entries[4] ? parseInt(entries[4], 10) : null;
      const red3 = entries[5] ? parseInt(entries[5], 10) : null;
      console.log(blue1)

      const response = await fetch('http://localhost:8000/recommend', {
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
      // setIsAwaitingPrediction(false)
      // setPreviousEntries(entries)
      // setPreviousMap(map)
      console.log('Got result:', data.prediction)

      // display an error if we can't connect to server
    } catch (error) {
      console.error(error)
      setResult('error');
    }
  };

  // Runs when the element loads
  useEffect(() => {
    // const shouldGetPredition = !anyEntriesEmpty() && (previousEntries != entries || previousMap != map)
    // if (shouldGetPredition) {
    //   console.log('Will get prediciton')
    //   getPrediction()
    // } else {
    //   console.log('should not get prediction')
    // }

    // const shouldGetRecommendations = anyEntriesEmpty() && (previousEntries != entries || previousMap != map)
    // if (shouldGetRecommendations) {
    //   console.log('Will get recs')
    //   getRecommendations()
    // } else {
    //   console.log('should not get recommendation')
    // }

    if (teamWithFirstPick == 'Red') {
      setSelectedBoxID(5)
    }
  }, [entries, map, teamWithFirstPick]); // Runs whenever these change

  const DraftOrderSelector = ({ boxID }) => {
    return (
      <div className={`thumb-div ${userDraftNumber == boxID ? 'selected-thumb':'unselected-thumb'}`} 
          onClick={ () => {
              setUserDraftNumber(boxID)
              moveToNextSection()
          }}>
          <img src={icons["ranked-icon.png"]}   />
          <p>{draftNumberStrings[boxID]}</p>
      </div>
    )
  }

  const MiniBanBoxes = () => {
    return ( 
      <div className="mini-ban-boxes">
        {bans.map((ban, index) => (
          <div key={index} className="mini-ban-box red-tint">
            <img src={icons[brawlers[ban].imgUrl]}></img>
          </div>
        ))}
      </div> 
    )
  }

  // Window scrolling functionality
  const firstPickSectionRef = useRef(null);
  const scrollToSection = () => {
    firstPickSectionRef.current.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // return the class name for a section.
  // The class name is determined by the visibility of the section.
  // The options are 'section-active' and 'section-inactive'
  function sectionClassName (id) {
    return `section-${IDofActiveSection == id ? 'active' : 'inactive'}`
  }

  // The thumbs up buttons to select which team has first pick
  const SelectWhoHasFirstPick = ({ color }) => {
    return (
      <div className={`thumb-div ${teamWithFirstPick == color ? 'selected-thumb':'unselected-thumb'}`} 
        onClick={ () => {
          setTeamWithFirstPick(color); 
          // only push the user forward if its their first time clicking the thumbs up/down
          if (IDofActiveSection == 0) {
            moveToNextSection()
            setMapSectionVisibility(true)
          }
        }}>
        <img src={icons[`thumbs-${color == 'Blue' ? 'up' : 'down'}.png`]}   />
        <p>{color == 'Blue' ? 'Your' : 'Enemy'} team</p>
      </div>
    )
  }

  // Shown in the top left of a section
  const SectionTitle = ({ text }) => {
    return (
      <div className="section-upper-part-left">
        <p>{text}</p>
      </div>
    )
  }

  // Shown in the top right of a section.
  console.log(IDofActiveSection)
  const SectionDescription = ({ sectionID, text, children }) => {
    return (
      <div className="section-upper-part-right">
        { IDofActiveSection > sectionID && (
          <p>{text}</p>
        )}
        {children}
      </div>
    )
  }

  const Section = ({ id, title, description, hasDoneButton=false, children}) => {
    console.log(bans)
    return (
      <div className={sectionClassName(id)}>
        <div className='section-upper-part'>
          <SectionTitle text={title} />

          <SectionDescription sectionID={id} text={description}>
            {IDofActiveSection == 3 && id == 3 && (
              <p onClick={moveToNextSection}>Done</p>
            )}
            {IDofActiveSection > 3 && id == 3 && (
              <MiniBanBoxes />
            )}
          </SectionDescription>
        </div>
        
        {IDofActiveSection == id && children}
      </div>
    )
  }

  return (
    <div className="input-page">
      {/* <div className='empty-space'></div> */}

      {/* Who's picking first? section */}
      <Section id='0' title='Which team has first pick?' description={teamWithFirstPick} >
        <div className="first-pick-section">
          <SelectWhoHasFirstPick color='Blue' />
          <SelectWhoHasFirstPick color='Red'/>
        </div>
      </Section>

      {/* Select Map section */}      
      <Section id='1' title='Select Map' description={map ? gameModes[maps[map].game_mode] + ' - ' + maps[map].name : ''}>
        <div className="section-lower-part">
          <MapSearchBar 
            selectedMap={map} 
            setMap={setMap}
            closeMapSearchBar={()=>setMapSectionVisibility(false)}
            moveUserForward={() => {
              if (IDofActiveSection == 1) {
                setMapSectionVisibility(false)
                setIDofActiveSection(2)
              }
            }}
          />
        </div>
      </Section>


      {/* When Do You Pick? section */}
      <Section id='2' title='When do you pick?' description={draftNumberStrings[userDraftNumber]}>
        <div className="first-pick-section">
          {(teamWithFirstPick == 'Blue' && 
            <>
              <DraftOrderSelector boxID={0} />
              <DraftOrderSelector boxID={3} />
              <DraftOrderSelector boxID={4} />
            </>
          )}
          {(teamWithFirstPick == 'Red' &&
            <>
              <DraftOrderSelector boxID={1} />
              <DraftOrderSelector boxID={2} />
              <DraftOrderSelector boxID={5} />
            </>
          )}
        </div>
      </Section>

      {/* Enter Bans section */}

      <Section id='3' title='Enter bans' description=''>
        <div className="teams">
          {bans.map((ban, index) => (
            <div key={index} className="ban-box" onClick={()=>removeBan(index)}>
              <img src={icons[brawlers[ban].imgUrl]} />
              <FaTimes className='x-button'/>
            </div>
          ))}
        </div>

        <div className="section-lower-part">  
          <BrawlerGallery 
              banMode={true}
              selectedBoxID={null} 
              setSelectedBoxID={null} 
              entries={bans} 
              setEntries={setBans}
              closeBrawlerSection={()=>{}}
          />
        </div>
      </Section>

      

      {/* Select Brawler section */}
      <div className={sectionClassName(4)}>
          <div className="section-upper-part">
            <SectionTitle text='Select Brawlers' />
            <div className="section-upper-part-right">
              <p className="selected">{entryGuides[rankedModeSelectionIndex]}</p>
            </div>
          </div>

          {IDofActiveSection == 4 && (
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
                <BrawlerGallery 
                    rankedMode={true}
                    firstPick={teamWithFirstPick}
                    userDraftNumber={userDraftNumber}
                    teamWithFirstPick={teamWithFirstPick}
                    rankedModeSelectionIndex={rankedModeSelectionIndex} 
                    setRankedModeSelectionIndex={setRankedModeSelectionIndex}

                    selectedBoxID={selectedBoxID} 
                    setSelectedBoxID={setSelectedBoxID} 
                    entries={entries} 
                    setEntries={setEntries}
                    closeBrawlerSection={()=>{
                    // setBrawlerSectionVisibility(false)
                    }}
                />
              </>
            </div>
          )}
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

      {/* Prediciton Description */}
      <div className="section">
          <div className="section-upper-part">
          <SectionTitle text='Prediction' />
         
          </div>

          <div className="section-lower-part">
          <PredictionDescription isAwaitingPrediction={isAwaitingPrediction} result={result}/>
          </div>

      </div>
    </div> 
  );
};

export default RankedPredictionPage;
// frontend/src/RankedPredictionPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { brawlers } from './data';
import { maps } from './mapData'
import BrawlerSelector from './BrawlerSelector';
import icons from './iconLoader';
import mapImages from './mapLoader';
import MapSelector from './MapSelector'
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

  var entryGuides = teamWithFirstPick == 'Blue' ? [
    "Enter Blue's first pick",
    "Enter Red's first pick",
    "Enter Red's second pick",
    "Enter Blue's second pick",
    "Enter Blue's last pick",
    "Enter Red's last pick"
  ] : [
    "Enter Red's first pick",
    "Enter Blue's first pick",
    "Enter Blue's second pick",
    "Enter Red's second pick",
    "Enter Red's last pick",
    "Enter Blue's last pick"
  ]

  const getRankedRecommendations = async () => {
    try {
      setIsAwaitingPrediction(true)

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

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      // setResult(data.result[0]);
      // setIsAwaitingPrediction(false)
      // setPreviousEntries(entries)
      // setPreviousMap(map)
      console.log('Got result:', data.result)

      // display an error if we can't connect to server
    } catch (error) {
      console.error(error)
    }
  };

  // Runs when the element loads
  useEffect(() => {
    if (teamWithFirstPick && map !== null){ // only get recommendations if these are defined
      getRankedRecommendations();
    }
  }, [map, entries]); // Runs when you select the map, and when entries change

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
  const SectionDescription = ({ sectionID, text, children, hasDoneButton=false }) => {
    return (
      <div className="section-upper-part-right"
        onClick={()=> {
          if (IDofActiveSection == 3){
            moveToNextSection()
          }
        }}>
        {/* Done button */}
        {hasDoneButton && sectionID == IDofActiveSection && (
          <p>Done</p>
        )}

        {/* Text to display */}
        <p>{text}</p>

        {/* Children: e.g. mini ban boxes */}
        {children}
      </div>
    )
  }

  const Section = ({ id, title, description, hasDoneButton=false, children}) => {
    return (
      <div className={sectionClassName(id)}>
        <div className='section-upper-part'>
          <SectionTitle text={title} />

          <SectionDescription sectionID={id} text={description} hasDoneButton={hasDoneButton}>
            {/* Done button and mini ban boxes on section 3  */}
            {id == 3 && IDofActiveSection > 3 && (
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
          <MapSelector 
            selectedMap={map} 
            setMap={setMap}
            closeMapSelector={()=>setMapSectionVisibility(false)}
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
      <Section id='2' title='When do you pick?' description={userDraftNumber ? draftNumberStrings[userDraftNumber] : ''}>
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

      <Section id='3' title='Enter bans' hasDoneButton={true}>
        <div className="teams">
          {bans.map((ban, index) => (
            <div key={index} className="ban-box" onClick={()=>removeBan(index)}>
              <img src={icons[brawlers[ban].imgUrl]} />
              <FaTimes className='x-button'/>
            </div>
          ))}
        </div>

        <div className="section-lower-part">  
          <BrawlerSelector 
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

      <Section id='4' title='Select Brawlers' description={entryGuides[rankedModeSelectionIndex]}>
        <div className="section-lower-part">  
          <BrawlerSelector 
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
        </div>
      </Section>
      
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
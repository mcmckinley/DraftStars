// frontend/src/RankedPredictionPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { brawlers } from './data';
import { maps } from './mapData'
import BrawlerSelector from './BrawlerSelector';
import icons from './iconLoader';
import mapImages from './mapLoader';
import MapSelector from './MapSelector'
import PredictionDescription from './PredictionDescription';
import SelectTeamWithFirstPick from './SelectTeamWithFirstPick';

import getRankedRecommendations from './getRankedRecommendations';

// chevrons
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import RankedRecommendationDisplay from './RankedRecommendationDisplay';

const RankedPredictionPage = () => {
  // The values for each entry box
  // const [entries, setEntries] = useState(['1', '11', '35', '77', '75', '73'])
  const [entries, setEntries] = useState(['', '', '', '', '', ''])

  const [teamWithFirstPick, setTeamWithFirstPick] = useState(null)
  const [userDraftNumber, setUserDraftNumber] = useState(null)

  const draftNumberStrings = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Last']

  const [rankedModeSelectionIndex, setRankedModeSelectionIndex] = useState(0)

  const [selectedBoxID, setSelectedBoxID] = useState(null)

  const [map, setMap] = useState(null)
  const [previousMap, setPreviousMap] = useState(0)
  

  const gameModes      = ['Gem Grab', 'Brawl Ball', 'Knockout', 'Wipeout', 'Heist', 'Hot Zone']
  const gameModeColors = ['#9430C1', '#95B0E4', '#FFBD33', '#33B8DF', '#BF86C6', '#E22525']

  const [isAwaitingPrediction, setIsAwaitingPrediction] = useState(false)

  const [IDofActiveSection, setIDofActiveSection] = useState(0)

  // passed down to RankedRecommendationDisplay; lets it know if it should request recommendations right away.
  const isFirstTimeLoadingSection3 = useRef(true)

  const previousEntries = useRef(entries)
  const previouslySelectedBox = useRef(selectedBoxID)

  const moveToNextSection = () => {
    setIDofActiveSection(IDofActiveSection + 1)
  }

  const [bans, setBans] = useState([])
  // When the x button under a ban is clicked, remove it
  const removeBan = (indexToRemove) => {
    const newBans = bans.filter((ban, index) => index !== indexToRemove);
    setBans(newBans);
  };

  var entryGuides = teamWithFirstPick == 'Blue' ? [
    "Select Blue's first pick",
    "Select Red's first pick",
    "Select Red's second pick",
    "Select Blue's second pick",
    "Select Blue's last pick",
    "Select Red's last pick"
  ] : [
    "Select Red's first pick",
    "Select Blue's first pick",
    "Select Blue's second pick",
    "Select Red's second pick",
    "Select Red's last pick",
    "Select Blue's last pick"
  ]

  // Runs when the element loads
  useEffect(() => {

  }, []); 

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
          if (hasDoneButton){
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
            {id == 2 && IDofActiveSection > 2 && (
              <MiniBanBoxes />
            )}
          </SectionDescription>
        </div>
        
        {IDofActiveSection == id && children}
      </div>
    )
  }

  return (
    <div className={`input-page`}>
      {/* <div className='empty-space'></div> */}

      {/* Select Map section */}      
      <Section id='0' title='Select Map' description={map ? gameModes[maps[map].game_mode] + ' - ' + maps[map].name : ''}>
        <div className="section-lower-part">
          <MapSelector 
            selectedMap={map} 
            setMap={setMap}
            moveToNextSection={moveToNextSection}
          />
        </div>
      </Section>

      {/* Who's picking first? section */}
      <Section id='1' title='Which team has first pick?' description={teamWithFirstPick} >
        <div className="first-pick-section">
          <SelectTeamWithFirstPick 
            teamWithFirstPick={teamWithFirstPick} 
            setTeamWithFirstPick={setTeamWithFirstPick}
            moveToNextSection={moveToNextSection} 
          />
        </div>
      </Section>

      {/* Enter Bans section */}
      <Section id='2' title='Enter bans' hasDoneButton={true}>
        {/* Shows the currently selected bans */}
        <div className="teams">
          {bans.map((ban, index) => (
            <div key={index} className="ban-box" onClick={()=>removeBan(index)}>
              <img src={icons[brawlers[ban].imgUrl]} />
              <FaTimes className='x-button'/>
            </div>
          ))}
        </div>

        {/* Shows list of brawlers */}
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

      <Section id='3' title='Select Brawlers' description={entryGuides[rankedModeSelectionIndex]}>
        <div className="section-lower-part">  
          <RankedRecommendationDisplay 
            teamWithFirstPick={teamWithFirstPick}
            rankedModeSelectionIndex={rankedModeSelectionIndex} 
            setRankedModeSelectionIndex={setRankedModeSelectionIndex}

            selectedBoxID={selectedBoxID} 
            setSelectedBoxID={setSelectedBoxID} 
            entries={entries} 
            setEntries={setEntries}
            bans={bans}
            map={map}
            isFirstTimeLoadingSection3={isFirstTimeLoadingSection3}
            previousEntries={previousEntries}
            previouslySelectedBox={previouslySelectedBox}
          />
        </div>
      </Section>
      
      {/* Prediction bar */}
      {/* <div className="section">
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
      </div>  */}

      {/* Prediciton Description */}
      {/* <div className="section">
          <div className="section-upper-part">
          <SectionTitle text='Prediction' />
         
          </div>

          <div className="section-lower-part">
          <PredictionDescription isAwaitingPrediction={isAwaitingPrediction} result={result}/>
          </div>

      </div> */}
    </div> 
  );
};

export default RankedPredictionPage;

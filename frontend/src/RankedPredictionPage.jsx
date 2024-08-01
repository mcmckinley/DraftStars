// frontend/src/RankedPredictionPage.jsx

import React, { useState, useEffect } from 'react';
import { brawlers } from './data';
import { maps } from './mapData'
import BrawlerEntryBox from './BrawlerEntryBox';
import BrawlerGallery from './BrawlerGallery';
import BrawlerGalleryItem from './BrawlerGalleryItem';
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

  const [selectedBoxID, setSelectedBoxID] = useState(0)

  const [map, setMap] = useState(0)
  const [previousMap, setPreviousMap] = useState(0)

  const [result, setResult] = useState(0.5)

  const [isShowingMapSection, setMapSectionVisibility] = useState(false)

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

  console.log('BANS:', bans)

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

  const MiniBanBoxes = ({ bans }) => {
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

  return (
    <div className="input-page">
      <div className={`section-${IDofActiveSection == 0 ? 'active' : 'inactive'}`}> {/* Who's picking first? section */}
          <div className="section-upper-part"> {/* this just works? */}
            <div className="section-upper-part-left">
              <p>Which Team Has First Pick?</p>
            </div>
          </div>
          <div className="first-pick-section">
            <div className={`thumb-div ${teamWithFirstPick == 'blue' ? 'selected-thumb':'unselected-thumb'}`} 
              onClick={ () => {
                setTeamWithFirstPick('blue'); 
                // only push the user forward if its their first time clicking the thumbs up/down
                if (IDofActiveSection == 0) {
                  moveToNextSection()
                  setMapSectionVisibility(true)
                }
              }}>
              <img src={icons["thumbs-up.png"]}   />
              <p>Your team</p>
            </div>
            <div className={`thumb-div ${teamWithFirstPick == 'red' ? 'selected-thumb':'unselected-thumb'}`} 
              onClick={ () => {
                setTeamWithFirstPick('red'); 
                if (IDofActiveSection == 0) {
                  moveToNextSection()
                  setMapSectionVisibility(true)
                }
              }}>
              <img src={icons["thumbs-down.png"]}   />
              <p>Enemy team</p>
            </div>
          </div>
      </div> 

      {/* Map section */}
      <div className={`section-${IDofActiveSection == 1 ? 'active' : 'inactive'}`}>
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
              moveUserForward={() => {
                if (IDofActiveSection == 1) {
                  setMapSectionVisibility(false)
                  setIDofActiveSection(2)
                }
              }}
              />
          </div>
          )}

      </div>

      {/* When Do You Pick? section */}
      <div className={`section-${IDofActiveSection == 2 ? 'active' : 'inactive'}`}>
        <div className="section-upper-part">
          <div className="section-upper-part-left">
            <p>When Do You Pick?</p>
          </div>
          <div className="section-upper-part-right" 
            onClick={() => {
              if (IDofActiveSection == 2) { // Deselect section
                setIDofActiveSection(3)
              } else if (IDofActiveSection > 2){
                setIDofActiveSection(2) // Lets user go back to a previous section.
              }
            }}>
            {IDofActiveSection == 2 ? (
              <FaChevronUp color="#bbb"/>
            ) : (
              <FaChevronDown color="#bbb"/>
            )}
            <p>{draftNumberStrings[userDraftNumber]}</p>
          </div>
        </div>

        {(IDofActiveSection == 2 &&
          <div className="first-pick-section">
          {(teamWithFirstPick == 'blue' && 
            <>
              <DraftOrderSelector boxID={0} />
              <DraftOrderSelector boxID={3} />
              <DraftOrderSelector boxID={4} />
            </>
          )}
          {(teamWithFirstPick == 'red' &&
            <>
              <DraftOrderSelector boxID={1} />
              <DraftOrderSelector boxID={2} />
              <DraftOrderSelector boxID={5} />
            </>
          )}
        </div>
        )}
      </div> 

      {/* Enter Bans section */}

      <div className={`section-${IDofActiveSection == 3 ? 'active' : 'inactive'}`}>
        <div className="section-upper-part">
          <div className="section-upper-part-left">
            <p>Enter Bans</p>
          </div>
          {IDofActiveSection != 3 && (
            <MiniBanBoxes bans={bans} />
          )}
          <div className="section-upper-part-right" onClick={() => {
              if (IDofActiveSection == 3) { // Deselect section
                setIDofActiveSection(4)
              } else if (IDofActiveSection > 3){
                setIDofActiveSection(3) // Lets user go back to a previous section.
              }
            }}>
            <p>Done</p>
          </div>
        </div>
        
        {IDofActiveSection == 3 && (
          <>
            {(bans.length > 0 && 
              <div className="teams">
                {
                  bans.map((ban, index) => (
                    <div className="ban-box" onClick={()=>removeBan(index)}>
                      <img key={index} src={icons[brawlers[ban].imgUrl]} />
                      <FaTimes className='x-button'/>
                    </div>
                  ))
                }
              </div>
          )}

            <div className="section-lower-part">  
                <>
                  {( selectedBoxID != null && 
                    <BrawlerGallery 
                        banMode={true}
                        selectedBoxID={null} 
                        setSelectedBoxID={null} 
                        entries={bans} 
                        setEntries={setBans}
                        closeBrawlerSection={()=>{}}
                    />
                  )}
                </>
            </div>
          </>
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
                  <BrawlerGallery 
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

      {/* Prediciton Description */}
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

export default RankedPredictionPage;
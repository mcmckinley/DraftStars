// getRankedRecommendations.jsx

// import React, { useState } from 'react'
import { brawlers } from '../data/brawlers'

// indices 33 and 55 are unused by the Brawl Stars API, and
// are not understood by the model. 
// Thus we must increase any index above 33 by one, and any index above 55 by two.
// Also, we repurpose index 33 to be used as a 'neutral' entry as a heuristic.
function adjustEntriesForModel(entryList){
  var adjustedList = []
  for (var entry of entryList) {
    if (entry == '') {
      adjustedList.push(33) 
    } else {
      var adjustedEntry = parseInt(entry)
      if (adjustedEntry >= 54) {
        adjustedEntry += 2
      } else if (adjustedEntry > 32) {
        adjustedEntry += 1
      }
      adjustedList.push(parseInt(adjustedEntry))
    } 
  }
  return adjustedList
}

// send the POST request to get recommendations from the model
const getRankedRecommendations = async (entries, bans, map, teamWithFirstPick) => {
  console.log('Getting ranked reccs. Bans:', bans)
  try {
    // console.log('getting ranked reccs')

    var payload = {
      'map': parseInt(map)
    }
    
    var adjustedEntries = adjustEntriesForModel(entries)
    var adjustedBans = adjustEntriesForModel(bans)

    payload['blue1'] = adjustedEntries[0]
    payload['blue2'] = adjustedEntries[1]
    payload['blue3'] = adjustedEntries[2]
    payload['red1'] = adjustedEntries[3]
    payload['red2'] = adjustedEntries[4]
    payload['red3'] = adjustedEntries[5]

    payload['blue_picks_first'] = teamWithFirstPick == 'Blue'

    // for (var i = 0; i < 6; i++){
    //   payload['ban' + String(i + 1)] = adjustedBans[i] !== '' ? adjustedBans[i] : null
    // }

    var numBans = bans.length;

    for (i in bans) {
      i = Number(i)
      payload['ban' + String(i + 1)] = adjustedBans[i]
    }
    for (var i = bans.length; i < 6; i++){
      payload['ban' + String(i + 1)] = null
    }

    console.log('Sending request:')
    console.log(payload)

    const response = await fetch('http://localhost:8000/get_ranked_recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    var result = data.result

    if (result['error']){
      return result
    }

    // Undo the operation preformed at the beginning of this function.
    for (var i = 0; i < result.length; i++) {
      if (result[i]['name'] >= 55) {
        result[i]['name'] -= 2
      } else if (result[i]['name'] >= 33) {
        result[i]['name'] -= 1
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
    console.log('GOT:')
    console.log(result)
    return result
    
    // display an error if we can't connect to server
  } catch (error) {
    console.log('Failed to get recommendations.')
    
    return {
      'error': 'Could not connect to the server.'
    }

    // Useful for development without backend
    // return [
    //   {'score': 0.6789, 'name': 1, 'counter': 2, 'response': 3},
    //   {'score': 0.3, 'name': 5, 'counter': 6, 'response': 7},
    //   {'name': 70, 'reason': 'BANNED'},
    //   {'name': 70, 'reason': 'PICKED'},
    //   {'name': 71, 'reason': 'NOT CONSIDERED'}
    // ]
  }
};

export default getRankedRecommendations

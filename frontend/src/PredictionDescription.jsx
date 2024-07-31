import React, { useState } from 'react'

function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}

const PredictionDescription = ({ isAwaitingPrediction, result }) => {
    if (result == null){
        return <p>Awaiting user entry.</p>
    } else if (isAwaitingPrediction) {
        return <p>Getting prediction...</p>
    } else if (result == 'error') {
        return <p>An error occured.</p>
    } else if (isNumber(result)) {
        return (
            <>
              <p>Blue team has a {Math.round(result * 100)}% chance of winning.</p>
              <p>Red team has a {Math.round((1-result) * 100)}% chance of winning.</p>
            </>
        )
    } else {
        return <p>An unknown error occured.</p>
    }
}

export default PredictionDescription;

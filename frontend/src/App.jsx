// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import HomePage from './HomePage';
import PredictOutcomePage from './PredictOutcomePage';
import RankedPredictionPage from './RankedPredictionPage';
import Sidebar from './Sidebar';

const App = () => {

  const [pageIndex, setPageIndex] = useState(0)

  var pages = [
    <HomePage setPageIndex={setPageIndex}/>,
    <RankedPredictionPage setPageIndex={setPageIndex} />, 
    // <PredictOutcomePage />
  ]
  var pageNames = [
    'Home', 
    'Ranked Predictor',
    // '3v3 Predictor'
  ]

  return pages[pageIndex]
};

export default App;
// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import HomePage from './HomePage';
import PredictOutcomePage from './PredictOutcomePage';
import RankedPredictionPage from './RankedPredictionPage';
import AboutPage from './AboutPage'
import Sidebar from './Sidebar';

const App = () => {

  const [pageIndex, setPageIndex] = useState(1)

  var pages = [
    <HomePage pageIndex={pageIndex} setPageIndex={setPageIndex}/>,
    <RankedPredictionPage pageIndex={pageIndex} setPageIndex={setPageIndex} />, 
    <AboutPage pageIndex={pageIndex} setPageIndex={setPageIndex}/>
  ]

  return pages[pageIndex]
};

export default App;
// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import HomePage from './HomePage';
import PredictOutcomePage from './PredictOutcomePage';
import RankedPredictionPage from './RankedPredictionPage';
import AboutPage from './AboutPage'
import FeedbackPage from './FeedbackPage';
import updateFavicon from './utils/favicon.js';

import icons from './iconLoader.js'

const App = () => {

  const [theme, setTheme] = useState('light');

  useEffect(() => {
    updateFavicon(theme == 'dark');
    if (theme == 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');

    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Automatically update the theme based on the user's setting

  useEffect(() => {
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(userPrefersDark ? 'dark' : 'light');
  }, []);
  

  const [pageIndex, setPageIndex] = useState(3)

  var pages = [
    <HomePage icons={icons} pageIndex={pageIndex} setPageIndex={setPageIndex}/>,
    <RankedPredictionPage pageIndex={pageIndex} setPageIndex={setPageIndex} />, 
    <AboutPage pageIndex={pageIndex} setPageIndex={setPageIndex}/>,
    <FeedbackPage pageIndex={pageIndex} setPageIndex={setPageIndex}/>
  ]

  return pages[pageIndex]
};

export default App;
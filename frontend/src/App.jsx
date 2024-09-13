// src/App.jsx
import React, { useState, useEffect } from 'react';

import HomePage from './homePage/HomePage';
import EnginePage from './enginePage/EnginePage.jsx';
import AboutPage from './aboutPage/AboutPage'
import FeedbackPage from './feedbackPage/FeedbackPage';

import updateFavicon from './utils/favicon.js';

import brawlerIcons from './utils/iconLoader.js'

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
  

  const [pageIndex, setPageIndex] = useState(0)

  var pages = [
    <HomePage brawlerIcons={brawlerIcons} pageIndex={pageIndex} setPageIndex={setPageIndex}/>,
    <EnginePage pageIndex={pageIndex} setPageIndex={setPageIndex} />, 
    <AboutPage pageIndex={pageIndex} setPageIndex={setPageIndex}/>,
    <FeedbackPage pageIndex={pageIndex} setPageIndex={setPageIndex}/>
  ]

  return pages[pageIndex]
};

export default App;
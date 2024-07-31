// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import PredictOutcomePage from './PredictOutcomePage';
import RankedPredictionPage from './RankedPredictionPage';

const App = () => {
  // UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [page, setPage] = useState(true)
  const togglePage = () => {
    setPage(!page)
  }

  // Called when size of page changes
  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
      setIsSidebarOpen(true); // Sidebar always open on desktop
    }
  };

  // Toggles sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  // Runs when the element loads
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize); // cleanup function
  }, []); // Runs whenever these change

  return (
    <div className="main">
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h1>BrawlMind</h1>
        <p className= {`sidebar-page-selector ${page ? '' : 'active'}`} onClick={() => setPage(false)}>Match Predictor</p>
        <p className= {`sidebar-page-selector ${page ? 'active' : ''}`} onClick={() => setPage(true)}>Ranked Predictor</p>
      </div>
      {page ? (
        <RankedPredictionPage />
      ) : (
        <PredictOutcomePage />
      )}
    </div> // main
  );
};

export default App;
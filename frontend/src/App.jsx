// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import PredictOutcomePage from './PredictOutcomePage';

const App = () => {
  // UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
      </div>

      <PredictOutcomePage />
    </div> // main
  );
};

export default App;
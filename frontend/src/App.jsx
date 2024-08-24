// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import PredictOutcomePage from './PredictOutcomePage';
import RankedPredictionPage from './RankedPredictionPage';
import Sidebar from './Sidebar';

const App = () => {

  const [page, setPage] = useState(true)
  const togglePage = () => {
    setPage(!page)
  }

  return (
    <div className="main">
      <Sidebar />
      {page ? (
        <RankedPredictionPage />
      ) : (
        <PredictOutcomePage />
      )}
    </div> // main
  );
};

export default App;
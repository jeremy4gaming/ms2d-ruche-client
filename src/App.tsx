import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { HiveDetail } from './pages/HiveDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hive/:id" element={<HiveDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
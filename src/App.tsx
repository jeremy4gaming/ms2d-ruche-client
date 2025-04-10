import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { HiveDetail } from './pages/HiveDetail';

/**
 * Composant principal de l'application
 * Définit les routes et la structure générale
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Route principale: liste des ruches */}
        <Route path="/" element={<Home />} />
        
        {/* Route de détail d'une ruche avec paramètre id */}
        <Route path="/hive/:id" element={<HiveDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
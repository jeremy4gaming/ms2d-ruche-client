import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { Home } from './pages/Home';
import { HiveDetail } from './pages/HiveDetail';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import { AlertProvider } from './contexts/AlertContext';

/**
 * Composant principal de l'application
 * Définit les routes et la structure générale avec le Layout
 */
function App() {
  return (
    <Router>
      <AlertProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Routes principales avec layout commun */}
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="hive/:id" element={<HiveDetail />} />
            
            {/* Page de paramètres complète */}
            <Route path="settings" element={<Settings />} />
            
            {/* Redirection des routes inconnues */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AlertProvider>
    </Router>
  );
}

export default App;
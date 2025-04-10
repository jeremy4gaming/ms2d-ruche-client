import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

/**
 * Point d'entrée de l'application React
 * Utilise la méthode createRoot de React 18 pour le rendu
 * StrictMode active des vérifications additionnelles pendant le développement
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

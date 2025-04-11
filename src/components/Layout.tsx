import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { NotificationsModal } from './NotificationsModal';
import { Menu, Bell } from 'lucide-react';
import { useAlerts } from '../contexts/AlertContext';

const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false); // Pour contrôler la visibilité sur mobile
  const location = useLocation();
  
  // Utiliser le contexte d'alertes
  const { 
    alerts, 
    hives, 
    showNotifications, 
    setShowNotifications 
  } = useAlerts();
  
  // Mémorise l'état du collapse dans localStorage et gère la responsivité
  useEffect(() => {
    // Récupérer la préférence utilisateur du localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setSidebarCollapsed(savedState === 'true');
    }
    
    // Sur les petits écrans, collapsons par défaut
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
        setSidebarVisible(false); // Cacher la sidebar sur mobile par défaut
      } else {
        setSidebarVisible(true); // Toujours visible sur desktop
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Vérifier au chargement
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Fermer la sidebar sur mobile lors du changement de page
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarVisible(false);
    } else if (window.innerWidth >= 1024 && sidebarCollapsed) {
      setSidebarCollapsed(false);
    }
  }, [location.pathname]);
  
  // Enregistrer la préférence utilisateur dans localStorage
  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      // Sur mobile, on bascule la visibilité
      setSidebarVisible(!sidebarVisible);
    } else {
      // Sur desktop, on bascule le collapse
      const newState = !sidebarCollapsed;
      setSidebarCollapsed(newState);
      localStorage.setItem('sidebarCollapsed', String(newState));
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay pour fermer la sidebar sur mobile */}
      {sidebarVisible && window.innerWidth < 768 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarVisible(false)}
        />
      )}
      
      {/* Sidebar avec gestion améliorée de la responsivité */}
      <div 
        className={`${
          sidebarVisible ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
      >
        <Sidebar 
          collapse={sidebarCollapsed} 
          onToggle={toggleSidebar} 
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 z-10">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="text-lg font-semibold text-gray-800 ml-2 truncate">
              {location.pathname === '/' ? 'Mes Ruches' : 
              location.pathname === '/dashboard' ? 'Mes Statistiques' : 
              location.pathname.includes('/hive/') ? 'Détail de la Ruche' : 
              'Paramètres'}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Cloche de notification avec compteur d'alertes */}
            <button 
              onClick={() => setShowNotifications(true)}
              className="p-2 rounded-full hover:bg-gray-100 relative"
              aria-label="Voir les notifications"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {alerts.length > 99 ? '99+' : alerts.length}
                </span>
              )}
            </button>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium hidden sm:inline-block">Jean Dupont</span>
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                JD
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content with padding adjustments for responsive design */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        
        {/* Modal de notifications (plein écran sur mobile) */}
        {showNotifications && (
          <NotificationsModal
            alerts={alerts}
            hives={hives}
            onClose={() => setShowNotifications(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Layout;

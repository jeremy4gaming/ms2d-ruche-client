import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { NotificationsModal } from './NotificationsModal';
import { Menu, Bell } from 'lucide-react';
import { useAlerts } from '../contexts/AlertContext';

const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  
  // Utiliser le contexte d'alertes
  const { 
    alerts, 
    hives, 
    showNotifications, 
    setShowNotifications 
  } = useAlerts();
  
  // Mémorise l'état du collapse dans localStorage
  useEffect(() => {
    // Récupérer la préférence utilisateur du localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setSidebarCollapsed(savedState === 'true');
    }
    
    // Sur les petits écrans, collapsons par défaut
    const handleResize = () => {
      if (window.innerWidth < 768 && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Vérifier au chargement
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Permet de ré-ouvrir automatiquement la sidebar sur les grands écrans
  // quand on change de page
  useEffect(() => {
    if (window.innerWidth >= 1024 && sidebarCollapsed) {
      setSidebarCollapsed(false);
    }
  }, [location.pathname]);
  
  // Enregistrer la préférence utilisateur dans localStorage
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        collapse={sidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="text-lg font-semibold text-gray-800 ml-2 md:ml-0">
            {location.pathname === '/' ? 'Mes Ruches' : 
             location.pathname === '/dashboard' ? 'Mes Statistiques' : 
             location.pathname.includes('/hive/') ? 'Détail de la Ruche' : 
             'Paramètres'}
          </div>
          
          <div className="flex items-center space-x-4">
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
              <span className="text-sm font-medium hidden md:inline-block">Jean Dupont</span>
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                JD
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        
        {/* Modal de notifications */}
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

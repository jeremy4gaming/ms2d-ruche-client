import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, Archive, PieChart, Settings, ChevronLeft, ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  collapse: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapse, onToggle }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Items avec ordre modifié: Mes ruches en premier, puis Mes statistiques (au lieu de Tableau de bord)
  const menuItems = [
    { path: '/', label: 'Mes ruches', icon: Archive },
    { path: '/dashboard', label: 'Mes statistiques', icon: PieChart },
    { path: '/settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <aside className={`bg-white h-full shadow-md transition-all duration-300 relative ${collapse ? 'w-20' : 'w-64'}`}>
      <div className="h-full flex flex-col justify-between">
        <div>
          {/* Logo et titre */}
          <div className="flex items-center h-16 border-b px-4">
            {!collapse && (
              <h1 className="text-xl font-bold text-blue-600 truncate">Equipe E - Ruche</h1>
            )}
            {collapse && (
              <div className="w-full flex justify-center">
                <span className="text-2xl">🐝</span>
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <nav className="mt-6 px-2">
            <ul className="space-y-2">
              {menuItems.map(item => {
                const IconComponent = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={`flex items-center ${
                        collapse ? 'justify-center' : 'space-x-3'
                      } px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      title={collapse ? item.label : undefined}
                      onClick={(e) => {
                        // Sur mobile, fermer la sidebar après avoir cliqué sur un lien
                        if (window.innerWidth < 768) {
                          onToggle();
                        }
                      }}
                    >
                      <IconComponent className="w-5 h-5 flex-shrink-0" />
                      {!collapse && <span>{item.label}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
      
      {/* Bouton de réduction/expansion de la sidebar - visible seulement sur desktop */}
      <button
        onClick={onToggle}
        className="absolute -right-4 top-20 bg-white rounded-full p-1 shadow-md border border-gray-200 hover:bg-gray-100 transition-colors hidden lg:block"
        title={collapse ? "Développer le menu" : "Réduire le menu"}
      >
        {collapse ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>
    </aside>
  );
};

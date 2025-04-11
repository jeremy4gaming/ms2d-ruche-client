import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Alert, Hive } from '../types';
import { getAlerts, getHives } from '../api';

interface AlertContextType {
  alerts: Alert[];
  hives: Hive[];
  loading: boolean;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  refreshAlerts: () => Promise<void>;
}

// Valeurs par défaut
const defaultValues: AlertContextType = {
  alerts: [],
  hives: [],
  loading: true,
  showNotifications: false,
  setShowNotifications: () => {},
  refreshAlerts: async () => {}
};

// Création du contexte
const AlertContext = createContext<AlertContextType>(defaultValues);

// Hook personnalisé pour utiliser le contexte
export const useAlerts = () => useContext(AlertContext);

interface AlertProviderProps {
  children: ReactNode;
}

// Fournisseur du contexte d'alertes
export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [hives, setHives] = useState<Hive[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fonction pour charger les alertes depuis l'API
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      
      // Chargement des alertes et des ruches en parallèle
      const [alertsData, hivesData] = await Promise.all([
        getAlerts(),
        getHives()
      ]);
      
      // Adapter les alertes pour inclure timestamp
      const adaptedAlerts = alertsData.map(alert => ({
        ...alert,
        timestamp: new Date(alert.createdAt)
      }));
      
      // Ne garder que les alertes actives
      const activeAlerts = adaptedAlerts.filter(alert => !alert.resolved);
      
      setAlerts(activeAlerts);
      setHives(hivesData);
      
    } catch (error) {
      console.error("Erreur lors du chargement des alertes:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Charger les alertes au montage du composant
  useEffect(() => {
    fetchAlerts();
    
    // Rafraîchir les alertes toutes les 5 minutes
    const intervalId = setInterval(fetchAlerts, 5 * 60 * 1000);
    
    // Nettoyer l'intervalle au démontage
    return () => clearInterval(intervalId);
  }, []);
  
  // Fournir le contexte à l'application
  return (
    <AlertContext.Provider 
      value={{
        alerts,
        hives,
        loading,
        showNotifications,
        setShowNotifications,
        refreshAlerts: fetchAlerts
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

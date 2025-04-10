import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { HiveCard } from '../components/HiveCard';
import { NotificationsModal } from '../components/NotificationsModal';
import { WeatherForecast } from '../components/WeatherForecast';
import { mockHives, mockAlerts } from '../data';
import { getHives, getAlerts } from '../api';
import { Hive, Alert } from '../types';

/**
 * Page d'accueil affichant la liste des ruches et les notifications
 */
export const Home: React.FC = () => {
  // État pour gérer l'affichage du modal des notifications
  const [showNotifications, setShowNotifications] = useState(false);
  // États pour stocker les données de l'API
  const [hives, setHives] = useState<Hive[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // État pour suivre si les données ont été chargées
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Chargement des données depuis l'API au chargement de la page
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Utilisation de try/catch individuels pour chaque appel API
        // pour éviter qu'une seule erreur fasse échouer toute la page
        let hivesData: Hive[] = [];
        let alertsData: Alert[] = [];
        
        try {
          hivesData = await getHives();
          console.log("Données ruches reçues:", hivesData);
          
          // Vérification des données
          if (!Array.isArray(hivesData)) {
            console.warn("Format des données de ruches invalide, utilisation des données mockées");
            hivesData = mockHives;
          }
          
          // Ajout du statut basé sur la valeur health et calcul de l'année de création
          hivesData = hivesData.map(hive => {
            // Extraire l'année de création à partir de creationDate
            let creationYear;
            
            if (hive.creationDate) {
              creationYear = new Date(hive.creationDate).getFullYear();
            } else {
              creationYear = new Date().getFullYear() - 1; // Valeur par défaut
            }
            
            return {
              ...hive,
              status: hive.health >= 80 ? 'good' : hive.health >= 60 ? 'warning' : 'danger',
              creationYear
            };
          });
          
        } catch (err) {
          console.error("Erreur lors du chargement des ruches:", err);
          hivesData = mockHives;
        }
        
        try {
          alertsData = await getAlerts();
          console.log("Données alertes reçues:", alertsData);
          
          // Vérification des données
          if (!Array.isArray(alertsData)) {
            console.warn("Format des données d'alertes invalide, utilisation des données mockées");
            alertsData = mockAlerts;
          }
          
          // Conversion du champ createdAt en objet Date pour la propriété timestamp
          alertsData = alertsData.map(alert => ({
            ...alert,
            timestamp: new Date(alert.createdAt)
          }));
          
          // Filtrer pour n'afficher que les alertes non résolues
          alertsData = alertsData.filter(alert => !alert.resolved);
          
        } catch (err) {
          console.error("Erreur lors du chargement des alertes:", err);
          alertsData = mockAlerts;
        }
        
        setHives(hivesData);
        setAlerts(alertsData);
        setError(null);
        setIsDataLoaded(true);
      } catch (err) {
        console.error("Erreur globale lors du chargement des données:", err);
        setError("Impossible de charger les données. Veuillez réessayer plus tard.");
        // Utiliser les données mockées comme fallback en cas d'erreur
        setHives(mockHives);
        setAlerts(mockAlerts);
        setIsDataLoaded(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Grouper les alertes par ruche, avec une vérification supplémentaire des données
  const alertsByHive = alerts.reduce((acc, alert) => {
    if (!alert || !alert.hiveId) return acc;
    
    if (!acc[alert.hiveId]) {
      acc[alert.hiveId] = [];
    }
    acc[alert.hiveId].push(alert);
    return acc;
  }, {} as Record<string, Alert[]>);

  // Regrouper les ruches par emplacement pour afficher la météo
  const hivesByLocation = hives.reduce((acc, hive) => {
    const location = hive.location || 'Emplacement inconnu';
    
    if (!acc[location]) {
      acc[location] = [];
    }
    
    acc[location].push(hive);
    return acc;
  }, {} as Record<string, Hive[]>);

  // Afficher un message console pour le débogage
  useEffect(() => {
    console.log("État actuel de la page Home:", {
      loading,
      hivesCount: hives.length,
      alertsCount: alerts.length,
      error,
      isDataLoaded
    });
  }, [loading, hives, alerts, error, isDataLoaded]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes Ruches</h1>
          <button 
            onClick={() => setShowNotifications(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50"
          >
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="text-gray-600">
              Alertes actives: {alerts && Array.isArray(alerts) ? alerts.length : 0}
            </span>
          </button>
        </div>

        {/* Affichage d'un message de chargement */}
        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des ruches...</p>
          </div>
        )}

        {/* Affichage d'un message d'erreur */}
        {error && !loading && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Affichage des ruches */}
        {!loading && isDataLoaded && hives.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600">Aucune ruche trouvée.</p>
          </div>
        )}

        {/* Affichage des ruches regroupées par emplacement - Météo déplacée sous les ruches */}
        {isDataLoaded && Object.entries(hivesByLocation).map(([location, locationHives]) => (
          <div key={location} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{location}</h2>
            
            {/* Grille de ruches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
              {locationHives.map(hive => (
                <HiveCard 
                  key={hive.id} 
                  hive={hive} 
                  alerts={alertsByHive[hive.id] || []}
                />
              ))}
            </div>
            
            {/* Composant de prévisions météo pour cet emplacement - maintenant sous les ruches */}
            <WeatherForecast location={location} />
          </div>
        ))}
      </div>

      {showNotifications && alerts && Array.isArray(alerts) && (
        <NotificationsModal
          alerts={alerts}
          hives={hives} // Passer la liste des ruches pour faire la correspondance entre ID et nom
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { HiveCard } from '../components/HiveCard';
import { WeatherForecast } from '../components/WeatherForecast';
import { mockHives } from '../data';
import { getHives } from '../api';
import { Hive } from '../types';
import { useAlerts } from '../contexts/AlertContext';

/**
 * Page d'accueil affichant la liste des ruches
 */
export const Home: React.FC = () => {
  // États pour stocker les données de l'API
  const [hives, setHives] = useState<Hive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // État pour suivre si les données ont été chargées
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // Utiliser le contexte d'alertes
  const { alerts } = useAlerts();

  // Chargement des données depuis l'API au chargement de la page
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        try {
          const hivesData = await getHives();
          console.log("Données ruches reçues:", hivesData);
          
          // Vérification des données
          if (!Array.isArray(hivesData)) {
            console.warn("Format des données de ruches invalide, utilisation des données mockées");
            setHives(mockHives);
          } else {
            // Ajout du statut basé sur la valeur health et calcul de l'année de création
            const processedHives = hivesData.map(hive => {
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
            
            setHives(processedHives);
          }
        } catch (err) {
          console.error("Erreur lors du chargement des ruches:", err);
          setHives(mockHives);
        }
        
        setError(null);
        setIsDataLoaded(true);
      } catch (err) {
        console.error("Erreur globale lors du chargement des données:", err);
        setError("Impossible de charger les données. Veuillez réessayer plus tard.");
        // Utiliser les données mockées comme fallback en cas d'erreur
        setHives(mockHives);
        setIsDataLoaded(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Grouper les alertes par ruche
  const alertsByHive = alerts.reduce((acc, alert) => {
    if (!alert || !alert.hiveId) return acc;
    
    if (!acc[alert.hiveId]) {
      acc[alert.hiveId] = [];
    }
    acc[alert.hiveId].push(alert);
    return acc;
  }, {} as Record<string, typeof alerts>);

  // Regrouper les ruches par emplacement pour afficher la météo
  const hivesByLocation = hives.reduce((acc, hive) => {
    const location = hive.location || 'Emplacement inconnu';
    
    if (!acc[location]) {
      acc[location] = [];
    }
    
    acc[location].push(hive);
    return acc;
  }, {} as Record<string, Hive[]>);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Suppression du titre en double */}

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
            
            {/* Grille de ruches - responsive avec breakpoints adaptés */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
              {locationHives.map(hive => (
                <HiveCard 
                  key={hive.id} 
                  hive={hive} 
                  alerts={alertsByHive[hive.id] || []}
                />
              ))}
            </div>
            
            {/* Composant de prévisions météo - adapté au responsive */}
            <WeatherForecast location={location} />
          </div>
        ))}
      </div>
    </div>
  );
};
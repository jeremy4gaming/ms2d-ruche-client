import React from 'react';
import { X, Clock, MapPin, Hash, Archive as HiveIcon, AlertTriangle } from 'lucide-react';
import { Alert, Hive } from '../types';
import { AlertBadge } from './AlertBadge';

interface NotificationsModalProps {
  alerts: Alert[];
  hives?: Hive[]; // Liste des ruches pour trouver le nom correspondant à chaque alerte
  onClose: () => void;
}

/**
 * Composant modal affichant la liste complète des notifications
 * avec les informations sur les ruches concernées
 */
export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  alerts,
  hives = [],
  onClose
}) => {
  if (!alerts || !Array.isArray(alerts)) {
    console.error("NotificationsModal: données d'alertes invalides", alerts);
    return null;
  }
  
  // Trie les alertes par date (plus récentes en premier)
  const sortedAlerts = [...alerts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Fonction pour trouver le nom d'une ruche par son ID
  const getHiveInfo = (hiveId: string): { name: string, location?: string } => {
    const hive = hives.find(h => h.id === hiveId);
    return {
      name: hive ? hive.name : `Ruche ${hiveId}`,
      location: hive?.location
    };
  };

  // Formatage de la date en français
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Erreur de formatage de date:", error);
      return dateString;
    }
  };

  // Fonctions utilitaires
  const getSeverityLabel = (severity: string): string => {
    switch (severity) {
      case 'high': return 'Critique';
      case 'medium': return 'Important';
      case 'low': return 'Faible';
      default: return 'Information';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Notifications</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {sortedAlerts.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Aucune alerte active</p>
          ) : (
            sortedAlerts.map(alert => {
              if (!alert || typeof alert !== 'object') return null;
              
              // Obtenir le nom et l'emplacement de la ruche correspondante
              const { name: hiveName, location } = getHiveInfo(alert.hiveId);
              
              // Classes de couleur basées sur la sévérité
              const severityClasses = {
                high: 'border-l-4 border-red-500 bg-red-50',
                medium: 'border-l-4 border-yellow-500 bg-yellow-50',
                low: 'border-l-4 border-blue-500 bg-blue-50',
              }[alert.severity] || 'border-l-4 border-gray-300 bg-gray-50';

              return (
                <div key={alert.id} className={`rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${severityClasses}`}>
                  {/* En-tête de la notification avec le nom de la ruche */}
                  <div className="bg-white bg-opacity-60 px-4 py-3 flex justify-between items-center border-b">
                    <div className="flex items-center">
                      <HiveIcon className="w-5 h-5 text-amber-600 mr-2" />
                      <h4 className="font-medium text-gray-800">{hiveName}</h4>
                      <div className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100">
                        ID: {alert.hiveId}
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{formatDate(alert.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start mb-3">
                      <AlertTriangle className={`w-5 h-5 mr-3 mt-0.5 ${
                        alert.severity === 'high' ? 'text-red-500' : 
                        alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <div>
                        <div className="flex items-center mb-1">
                          <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
                            alert.severity === 'high' ? 'bg-red-100 text-red-800' : 
                            alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {getSeverityLabel(alert.severity)}
                          </span>
                        </div>
                        <p className="text-gray-800 font-medium">
                          {(alert.type === 'temperature' ? 'Température' : 
                            alert.type === 'humidity' ? 'Humidité' : 
                            alert.type === 'weight' ? 'Poids' : 'Activité')}: {alert.message}
                        </p>
                      </div>
                    </div>
                    
                    {location && (
                      <div className="flex items-center text-gray-600 text-sm mt-3 ml-8">
                        <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                        <span className="truncate">{location}</span>
                      </div>
                    )}
                    
                    {alert.resolved && (
                      <div className="mt-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-8">
                        Résolu
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
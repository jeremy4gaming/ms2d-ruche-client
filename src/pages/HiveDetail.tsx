import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Archive as HiveIcon, AlertTriangle, ArrowLeft, Printer, Scale, Thermometer, Droplets, MapPin, Calendar } from 'lucide-react';
import { mockHives, mockAlerts, generateTimeSeriesData } from '../data';
import { AlertBadge } from '../components/AlertBadge';
import { InterventionModal } from '../components/InterventionModal';
import { ExportDataButton } from '../components/ExportDataButton';
import { Alert, Hive, TimeSeriesData } from '../types';
import { getHive, getAlerts, getHiveData, createIntervention } from '../api';

/**
 * Page de détail d'une ruche
 * Affiche les informations détaillées, les alertes et les graphiques
 */
export const HiveDetail: React.FC = () => {
  // Récupération de l'identifiant de la ruche depuis l'URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // État pour gérer l'alerte sélectionnée (pour intervention)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  
  // État pour la période affichée dans les graphiques
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');

  // États pour stocker les données de l'API
  const [hive, setHive] = useState<Hive | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [weightData, setWeightData] = useState<TimeSeriesData[]>([]);
  const [temperatureData, setTemperatureData] = useState<TimeSeriesData[]>([]);
  const [humidityData, setHumidityData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInterventionModal, setShowInterventionModal] = useState(false);

  // Chargement des données depuis l'API au chargement de la page
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Chargement parallèle des données de la ruche et des alertes
        const [hiveData, alertsData] = await Promise.all([
          getHive(id),
          getAlerts(id)
        ]);
        
        // Adapter les données de ruche au format attendu par le composant
        const adaptedHive: Hive = {
          ...hiveData,
          // Ajouter les propriétés manquantes pour la compatibilité
          status: hiveData.health >= 80 ? 'good' : hiveData.health >= 60 ? 'warning' : 'danger',
          // Utiliser creationDate pour calculer creationYear si nécessaire
          creationYear: hiveData.creationDate 
            ? new Date(hiveData.creationDate).getFullYear()
            : new Date().getFullYear() - 1,
          supers: 2 // Valeur par défaut
        };
        
        // Adapter les alertes pour inclure timestamp au format Date
        const adaptedAlerts = alertsData.map(alert => ({
          ...alert,
          timestamp: new Date(alert.createdAt)
        }));
        
        setHive(adaptedHive);
        setAlerts(adaptedAlerts);
        
        // Chargement des données pour les graphiques
        await loadGraphData(id, timeRange);
        
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Impossible de charger les données de la ruche. Veuillez réessayer plus tard.");
        
        // Utiliser les données mockées comme fallback en cas d'erreur
        const mockHive = mockHives.find(h => h.id === id);
        if (mockHive) {
          setHive(mockHive);
          setAlerts(mockAlerts.filter(a => a.hiveId === id));
          
          // Générer des données fictives pour les graphiques
          const days = timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
          setWeightData(generateTimeSeriesData(days, 'weight'));
          setTemperatureData(generateTimeSeriesData(days, 'temperature'));
          setHumidityData(generateTimeSeriesData(days, 'humidity'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Rechargement des données graphiques lors du changement de période
  useEffect(() => {
    if (id && !loading) {
      loadGraphData(id, timeRange).catch(err => {
        console.error("Erreur lors du chargement des données graphiques:", err);
        // Utiliser des données mockées en fallback
        const days = timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
        setWeightData(generateTimeSeriesData(days, 'weight'));
        setTemperatureData(generateTimeSeriesData(days, 'temperature'));
        setHumidityData(generateTimeSeriesData(days, 'humidity'));
      });
    }
  }, [timeRange, id]);

  // Fonction pour charger les données des graphiques
  const loadGraphData = async (hiveId: string, range: 'day' | 'week' | 'month' | 'year') => {
    try {
      // Chargement parallèle des trois types de données
      const [weight, temperature, humidity] = await Promise.all([
        getHiveData(hiveId, 'weight', range),
        getHiveData(hiveId, 'temperature', range),
        getHiveData(hiveId, 'humidity', range)
      ]);
      
      setWeightData(weight);
      setTemperatureData(temperature);
      setHumidityData(humidity);
    } catch (error) {
      console.error("Erreur lors du chargement des données graphiques:", error);
      throw error;
    }
  };

  // Gestion des actions sur les alertes
  const handleAlertAction = async (
    action: 'intervene' | 'ignore' | 'skip', 
    formData?: {
      actionId: string;
      notes: string;
      date: string;
      hiveId: string;
      alertId?: string;
      photoFiles?: File[];
    }
  ) => {
    if (!hive) return;
    
    if (action === 'intervene' && formData) {
      try {
        // Afficher un message de chargement si des photos sont à uploader
        if (formData.photoFiles && formData.photoFiles.length > 0) {
          console.log(`Chargement de ${formData.photoFiles.length} photo(s) en cours...`);
        }
        
        // Appel à l'API avec les données complètes du formulaire
        await createIntervention({
          hiveId: formData.hiveId,
          actionId: formData.actionId,
          alertId: formData.alertId,
          notes: formData.notes,
          date: formData.date,
          photoFiles: formData.photoFiles
        });
        
        // Afficher un message de confirmation
        alert("Intervention enregistrée avec succès !");
        
        // Fermer les modals
        setSelectedAlert(null);
        setShowInterventionModal(false);
        
        // Recharger les alertes après l'intervention
        if (id) {
          const newAlerts = await getAlerts(id);
          setAlerts(newAlerts);
        }
      } catch (err) {
        console.error("Erreur lors de l'enregistrement de l'intervention:", err);
        alert("Erreur lors de l'enregistrement de l'intervention.");
      }
    } else {
      // Fermer les modals pour les autres actions
      setSelectedAlert(null);
      setShowInterventionModal(false);
    }
  };

  /**
   * Composant pour les cartes de graphiques
   * Réutilisé pour les trois mesures (poids, température, humidité)
   */
  const ChartCard = ({ title, data, dataKey = 'value', unit, color, icon: Icon, alerts = [] }: {
    title: string;
    data: any[];
    dataKey?: string;
    unit: string;
    color: string;
    icon: React.ElementType;
    alerts?: Alert[];
  }) => {
    // Préparation des données avec marquage des alertes venant de l'API
    const enhancedData = React.useMemo(() => {
      const enhancedPoints = [...data];
      
      // Pour chaque alerte provenant de l'API, trouver le point correspondant dans les données
      alerts.forEach(alert => {
        // Utiliser la date de l'alerte provenant de l'API (createdAt)
        const alertDate = new Date(alert.createdAt);
        const formattedDate = alertDate.toISOString().split('T')[0];
        
        // Chercher le point de données correspondant à cette date
        const pointIndex = enhancedPoints.findIndex(p => 
          new Date(p.timestamp).toISOString().split('T')[0] === formattedDate
        );
        
        // Si trouvé, marquer ce point comme une alerte
        if (pointIndex >= 0) {
          enhancedPoints[pointIndex] = {
            ...enhancedPoints[pointIndex],
            isAlert: true,
            alertId: alert.id,            // Garder l'ID pour référence
            alertSeverity: alert.severity, // Niveau de gravité pour la couleur
            alertMessage: alert.message,   // Message d'alerte pour l'affichage
            alertType: alert.type          // Type d'alerte
          };
        } else {
          console.warn(`Aucun point de données trouvé pour l'alerte du ${formattedDate}`);
        }
      });
      
      return enhancedPoints;
    }, [data, alerts]);
    
    // Fonction de rendu personnalisé pour les points du graphique
    const renderDot = (props: any) => {
      const { cx, cy, payload } = props;
      
      // Si le point correspond à une alerte, le rendre plus grand avec la couleur de sévérité
      if (payload.isAlert) {
        const alertColor = 
          payload.alertSeverity === 'high' ? '#ef4444' : 
          payload.alertSeverity === 'medium' ? '#f59e0b' : '#3b82f6';
        
        return (
          <svg>
            <circle cx={cx} cy={cy} r={5} fill={alertColor} stroke="white" strokeWidth={2} />
            <circle 
              cx={cx} 
              cy={cy} 
              r={8} 
              fill="none" 
              stroke={alertColor} 
              strokeWidth={1.5} 
              opacity={0.6} 
              className="pulse-critical" 
            />
          </svg>
        );
      }
      
      return null;
    };
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        {/* En-tête avec icône et titre */}
        <div className="flex items-center space-x-3 mb-4">
          <Icon className="w-6 h-6 text-gray-600" />
          <h3 className="text-xl font-semibold">{title}</h3>
          {alerts.length > 0 && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              {alerts.length} alerte{alerts.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        {/* Graphique */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={enhancedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="timestamp"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}${unit}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload;
                    
                    return (
                      <div className="bg-white p-3 border shadow-md rounded-md">
                        <p className="font-medium">{new Date(label).toLocaleDateString()}</p>
                        <p className="text-gray-800">{`${title}: ${Number(payload[0].value).toFixed(1)}${unit}`}</p>
                        {dataPoint.isAlert && (
                          <div className={`mt-2 text-sm ${
                            dataPoint.alertSeverity === 'high' ? 'text-red-600' : 
                            dataPoint.alertSeverity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                          }`}>
                            <span className="font-bold">Alerte:</span> {dataPoint.alertMessage}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              
              {/* Ligne principale avec points d'alerte */}
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={(props) => renderDot(props)}
                activeDot={{ r: 6, fill: color, stroke: 'white', strokeWidth: 2 }}
                name={title}
                connectNulls={true}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Légende des alertes si présentes */}
        {alerts.length > 0 && (
          <div className="mt-4 text-xs flex flex-wrap gap-3">
            {alerts.some(a => a.severity === 'high') && (
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-gray-600">Alerte critique</span>
              </div>
            )}
            {alerts.some(a => a.severity === 'medium') && (
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                <span className="text-gray-600">Alerte importante</span>
              </div>
            )}
            {alerts.some(a => a.severity === 'low') && (
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                <span className="text-gray-600">Alerte faible</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données de la ruche...</p>
        </div>
      </div>
    );
  }

  if (error || !hive) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour aux ruches
            </button>
          </div>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error || "Ruche non trouvée"}</p>
          </div>
        </div>
      </div>
    );
  }

  // Filtrer les alertes par type pour les associer aux bons graphiques
  const weightAlerts = alerts.filter(a => a.type === 'weight');
  const temperatureAlerts = alerts.filter(a => a.type === 'temperature');
  const humidityAlerts = alerts.filter(a => a.type === 'humidity');

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Lien de retour */}
        <div className="mb-6">
          <a href="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Retour aux ruches</span>
          </a>
        </div>

        {/* En-tête avec informations de la ruche et QR code - Responsive */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <HiveIcon className="w-12 h-12 text-amber-600" />
              <div>
                {/* Nom de la ruche ajouté ici */}
                <h2 className="text-xl font-bold text-gray-800 mb-1">{hive.name}</h2>
                <div className="text-xs text-gray-500 mb-2">
                  ID: {hive.id}
                </div>
                {hive.location && (
                  <div className="flex items-center text-gray-600 mb-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{hive.location}</span>
                  </div>
                )}
                <p className="text-gray-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {hive.creationDate 
                    ? `Créée le ${new Date(hive.creationDate).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}` 
                    : `Créée en ${hive.creationYear || 'date inconnue'}`
                  }
                </p>
              </div>
            </div>
            
            {/* Image et QR code côte à côte sur desktop, empilés sur mobile */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Image de la ruche si disponible */}
              {hive.imageUrl && (
                <div className="max-w-[200px] rounded-lg overflow-hidden">
                  <img 
                    src={hive.imageUrl} 
                    alt={hive.name}
                    className="w-full h-auto" 
                  />
                </div>
              )}
              
              <div className="flex sm:flex-col space-x-4 sm:space-x-0 sm:space-y-4">
                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-2 bg-gray-100 px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-200 text-sm"
                >
                  <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Imprimer QR Code</span>
                </button>
                <div className="w-16 h-16 sm:w-24 sm:h-24">
                  <QRCodeSVG
                    value={hive.id}
                    size={96}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Indicateur de santé */}
          {typeof hive.health === 'number' && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">État de santé</span>
                <span className="text-sm font-medium">{hive.health}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className={`h-2.5 rounded-full ${
                    hive.health >= 80 ? 'bg-green-600' : 
                    hive.health >= 60 ? 'bg-yellow-400' : 'bg-red-600'
                  }`} 
                  style={{ width: `${hive.health}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Section des alertes actives */}
        {alerts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold">Alertes actives</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {alerts.filter(a => !a.resolved).map(alert => (
                <AlertBadge
                  key={alert.id}
                  alert={alert}
                  onClick={() => setSelectedAlert(alert)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sélection de la période pour les graphiques */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 sm:space-x-2 mb-4">
            {/* Gauche: Bouton d'exportation des données */}
            {hive && (
              <ExportDataButton 
                hive={hive}
                timeSeriesData={{
                  weight: weightData || [],
                  temperature: temperatureData || [],
                  humidity: humidityData || []
                }}
                timeRange={timeRange}
              />
            )}
          
            {/* Droite: Sélection de la période - scroll horizontal sur mobile */}
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {(['day', 'week', 'month', 'year'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg whitespace-nowrap ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range === 'day' ? 'Jour' : 
                  range === 'week' ? 'Semaine' : 
                  range === 'month' ? 'Mois' : 'Année'}
                </button>
              ))}
            </div>
          </div>

          {/* Graphiques pour chaque type de mesure */}
          <ChartCard
            title="Poids"
            data={weightData}
            unit="kg"
            color="#2563eb"
            icon={Scale}
            alerts={weightAlerts}
          />

          <ChartCard
            title="Température"
            data={temperatureData}
            unit="°C"
            color="#dc2626"
            icon={Thermometer}
            alerts={temperatureAlerts}
          />

          <ChartCard
            title="Humidité"
            data={humidityData}
            unit="%"
            color="#0891b2"
            icon={Droplets}
            alerts={humidityAlerts}
          />
        </div>

        {/* Bouton flottant pour déclencher une intervention */}
        <div className="fixed bottom-6 right-6 z-20">
          <button 
            onClick={() => {
              setSelectedAlert(null);
              setShowInterventionModal(true);
            }}
            className="bg-blue-600 text-white p-3 sm:px-6 sm:py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <span className="hidden sm:inline mr-2">Déclencher une intervention</span>
            <span className="sm:hidden">+</span>
          </button>
        </div>

        {/* Modal d'intervention (apparaît uniquement quand une alerte est sélectionnée) */}
        {selectedAlert && (
          <InterventionModal
            alert={selectedAlert}
            hiveId={hive.id}
            onClose={() => setSelectedAlert(null)}
            onAction={handleAlertAction}
          />
        )}

        {/* Modal d'intervention sans alerte (apparaît lorsque l'utilisateur clique sur "Déclencher une intervention") */}
        {showInterventionModal && hive && (
          <InterventionModal
            hiveId={hive.id}
            onClose={() => setShowInterventionModal(false)}
            onAction={handleAlertAction}
            directActionSelection={true} // Ouvrir directement la sélection d'action
          />
        )}
      </div>
    </div>
  );
};

export default HiveDetail;
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
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
import { Archive as HiveIcon, AlertTriangle, ArrowLeft, Printer, Scale, Thermometer, Droplets } from 'lucide-react';
import { mockHives, mockAlerts, generateTimeSeriesData } from '../data';
import { AlertBadge } from '../components/AlertBadge';
import { InterventionModal } from '../components/InterventionModal';
import { Alert } from '../types';

/**
 * Page de détail d'une ruche
 * Affiche les informations détaillées, les alertes et les graphiques
 */
export const HiveDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');

  // Récupération des données de la ruche et des alertes
  const hive = mockHives.find(h => h.id === id);
  const alerts = mockAlerts.filter(a => a.hiveId === id);

  // Génération des données pour les graphiques selon la période sélectionnée
  const days = timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
  const weightData = generateTimeSeriesData(days, 'weight');
  const temperatureData = generateTimeSeriesData(days, 'temperature');
  const humidityData = generateTimeSeriesData(days, 'humidity');

  if (!hive) return <div>Ruche non trouvée</div>;

  // Gestion des actions sur les alertes
  const handleAlertAction = (action: 'intervene' | 'ignore' | 'skip') => {
    console.log(`Action ${action} pour l'alerte`, selectedAlert);
    setSelectedAlert(null);
  };

  // Composant pour les graphiques
  const ChartCard = ({ title, data, dataKey = 'value', unit, color, icon: Icon, alerts = [] }: {
    title: string;
    data: any[];
    dataKey?: string;
    unit: string;
    color: string;
    icon: React.ElementType;
    alerts?: Alert[];
  }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <Icon className="w-6 h-6 text-gray-600" />
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
              formatter={(value: number) => [`${value.toFixed(1)}${unit}`, title]}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
              name={title}
            />
            {/* Points pour les alertes */}
            {alerts.map((alert, index) => (
              <Line
                key={alert.id}
                type="monotone"
                data={[{
                  timestamp: alert.timestamp.toISOString().split('T')[0],
                  value: data.find(d => d.timestamp === alert.timestamp.toISOString().split('T')[0])?.value
                }]}
                stroke={alert.severity === 'danger' ? '#ef4444' : '#f59e0b'}
                strokeWidth={0}
                dot={{
                  r: 6,
                  fill: alert.severity === 'danger' ? '#ef4444' : '#f59e0b',
                  stroke: 'white',
                  strokeWidth: 2
                }}
                name={`Alerte ${index + 1}`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // Filtrer les alertes par type pour les graphiques
  const weightAlerts = alerts.filter(a => a.type === 'weight');
  const temperatureAlerts = alerts.filter(a => a.type === 'temperature');
  const humidityAlerts = alerts.filter(a => a.type === 'humidity');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <a href="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux ruches
          </a>
        </div>

        {/* En-tête avec informations de la ruche */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <HiveIcon className="w-12 h-12 text-amber-600" />
              <div>
                <h1 className="text-3xl font-bold">{hive.name}</h1>
                <p className="text-gray-600">Créée en {hive.creationYear}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                <Printer className="w-5 h-5" />
                <span>Imprimer QR Code</span>
              </button>
              <div className="w-24 h-24">
                <QRCodeSVG
                  value={`https://apiculture.app/hive/${hive.id}`}
                  size={96}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section des alertes */}
        {alerts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold">Alertes actives</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {alerts.map(alert => (
                <AlertBadge
                  key={alert.id}
                  alert={alert}
                  onClick={() => setSelectedAlert(alert)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sélection de la période */}
        <div className="mb-6">
          <div className="flex justify-end space-x-2 mb-4">
            {(['day', 'week', 'month', 'year'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg ${
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

          {/* Graphiques */}
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

        {/* Bouton d'intervention */}
        <div className="fixed bottom-6 right-6">
          <button 
            onClick={() => setSelectedAlert(alerts[0] || null)}
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            Déclencher une intervention
          </button>
        </div>

        {/* Modal d'intervention */}
        {selectedAlert && (
          <InterventionModal
            alert={selectedAlert}
            onClose={() => setSelectedAlert(null)}
            onAction={handleAlertAction}
          />
        )}
      </div>
    </div>
  );
};

export default HiveDetail;
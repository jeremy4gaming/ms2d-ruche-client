import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Droplets, Thermometer, Scale, AlertTriangle, 
  Calendar, PieChart as PieChartIcon
} from 'lucide-react';
import { getHives, getAlerts } from '../api';
import { Hive, Alert } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [hives, setHives] = useState<Hive[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [hivesData, alertsData] = await Promise.all([
          getHives(),
          getAlerts()
        ]);
        
        setHives(hivesData);
        setAlerts(alertsData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Données pour le graphique d'état des ruches
  const hiveStatusData = [
    { name: 'Bon état', value: hives.filter(h => h.health >= 80).length, color: '#10B981' },
    { name: 'Surveillance', value: hives.filter(h => h.health >= 60 && h.health < 80).length, color: '#F59E0B' },
    { name: 'Attention requise', value: hives.filter(h => h.health < 60).length, color: '#EF4444' }
  ];

  // Compter les alertes par type
  const alertsByType = alerts.reduce((acc, alert) => {
    acc[alert.type] = (acc[alert.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convertir en format pour graphique
  const alertsChartData = Object.entries(alertsByType).map(([type, count]) => ({
    name: type === 'temperature' ? 'Température' :
          type === 'humidity' ? 'Humidité' :
          type === 'weight' ? 'Poids' : 'Activité',
    count
  }));

  // Simulation de données de production
  const productionData = [
    { month: 'Jan', production: 0 },
    { month: 'Fév', production: 0 },
    { month: 'Mar', production: 5 },
    { month: 'Avr', production: 12 },
    { month: 'Mai', production: 20 },
    { month: 'Jun', production: 30 },
    { month: 'Jul', production: 35 },
    { month: 'Aoû', production: 28 },
    { month: 'Sep', production: 18 },
    { month: 'Oct', production: 8 },
    { month: 'Nov', production: 0 },
    { month: 'Déc', production: 0 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Cartes de statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">Ruches totales</p>
                <p className="text-3xl font-bold">{hives.length}</p>
              </div>
              <div className="bg-blue-100 h-12 w-12 rounded-full flex items-center justify-center">
                <PieChartIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">Alertes actives</p>
                <p className="text-3xl font-bold">{alerts.filter(a => !a.resolved).length}</p>
              </div>
              <div className="bg-red-100 h-12 w-12 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">Production mensuelle</p>
                <p className="text-3xl font-bold">28kg</p>
              </div>
              <div className="bg-green-100 h-12 w-12 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">Santé moyenne</p>
                <p className="text-3xl font-bold">
                  {hives.length > 0 
                    ? Math.round(hives.reduce((sum, hive) => sum + hive.health, 0) / hives.length) 
                    : 0}%
                </p>
              </div>
              <div className="bg-purple-100 h-12 w-12 rounded-full flex items-center justify-center">
                <Droplets className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Graphiques pour analyse */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* État des ruches */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">État du rucher</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hiveStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {hiveStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} ruches`, 'Quantité']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Alertes par type */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Distribution des alertes</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertsChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Nombre d'alertes" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Production annuelle */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Production annuelle (kg)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} kg`, 'Production']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="production" 
                  name="Production de miel" 
                  stroke="#10B981" 
                  strokeWidth={2} 
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;

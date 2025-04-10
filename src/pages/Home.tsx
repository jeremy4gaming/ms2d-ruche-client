import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { HiveCard } from '../components/HiveCard';
import { NotificationsModal } from '../components/NotificationsModal';
import { mockHives, mockAlerts } from '../data';

/**
 * Page d'accueil affichant la liste des ruches et les notifications
 */
export const Home: React.FC = () => {
  // État pour gérer l'affichage du modal des notifications
  const [showNotifications, setShowNotifications] = useState(false);

  // Grouper les alertes par ruche
  const alertsByHive = mockAlerts.reduce((acc, alert) => {
    if (!acc[alert.hiveId]) {
      acc[alert.hiveId] = [];
    }
    acc[alert.hiveId].push(alert);
    return acc;
  }, {} as Record<string, typeof mockAlerts>);

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
              Alertes actives: {mockAlerts.length}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockHives.map(hive => (
            <HiveCard 
              key={hive.id} 
              hive={hive} 
              alerts={alertsByHive[hive.id] || []}
            />
          ))}
        </div>
      </div>

      {showNotifications && (
        <NotificationsModal
          alerts={mockAlerts}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};
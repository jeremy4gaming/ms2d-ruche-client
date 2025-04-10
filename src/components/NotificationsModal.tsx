import React from 'react';
import { X } from 'lucide-react';
import { Alert } from '../types';
import { mockHives } from '../data';
import { AlertBadge } from './AlertBadge';

interface NotificationsModalProps {
  alerts: Alert[];
  onClose: () => void;
}

/**
 * Composant modal affichant la liste complète des notifications
 * avec les informations sur les ruches concernées
 */
export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  alerts,
  onClose
}) => {
  // Trie les alertes par date (plus récentes en premier)
  const sortedAlerts = [...alerts].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

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
          {sortedAlerts.map(alert => {
            // Trouve la ruche concernée par l'alerte
            const hive = mockHives.find(h => h.id === alert.hiveId);
            
            return (
              <div key={alert.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <AlertBadge alert={alert} />
                <div>
                  <h4 className="font-medium">{hive?.name}</h4>
                  <p className="text-sm text-gray-600">
                    {alert.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
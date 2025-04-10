import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive as HiveIcon, Thermometer, Droplets, Scale } from 'lucide-react';
import { Hive, Alert } from '../types';
import { AlertBadge } from './AlertBadge';

interface HiveCardProps {
  hive: Hive;
  alerts: Alert[];
}

/**
 * Couleurs associées aux différents statuts d'une ruche
 * Utilisées pour l'indicateur visuel d'état
 */
const statusColors = {
  good: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500'
};

/**
 * Carte représentant une ruche sur la page d'accueil
 * Affiche les informations essentielles et les alertes actives
 * Cliquable pour accéder à la page de détail
 */
export const HiveCard: React.FC<HiveCardProps> = ({ hive, alerts }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/hive/${hive.id}`)}
      className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform transition-transform hover:scale-105"
    >
      {/* Affichage des alertes en haut de la carte si présentes */}
      {alerts.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 -mt-2">
          {alerts.map(alert => (
            <AlertBadge key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      {/* En-tête avec nom et indicateur d'état */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <HiveIcon className="w-8 h-8 text-amber-600" />
          <h3 className="text-xl font-semibold">{hive.name}</h3>
        </div>
        {/* Indicateur visuel d'état (vert, jaune, rouge) */}
        <div className={`w-3 h-3 rounded-full ${statusColors[hive.status]}`} />
      </div>

      {/* Grille des mesures principales */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Scale className="w-5 h-5 text-gray-600" />
          <span>{hive.weight.toFixed(1)} kg</span>
        </div>
        <div className="flex items-center space-x-2">
          <Thermometer className="w-5 h-5 text-gray-600" />
          <span>{hive.temperature}°C</span>
        </div>
        <div className="flex items-center space-x-2">
          <Droplets className="w-5 h-5 text-gray-600" />
          <span>{hive.humidity}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium">{hive.supers}</span>
          <span>hausses</span>
        </div>
      </div>

      {/* Année de création */}
      <div className="text-sm text-gray-600">
        Création: {hive.creationYear}
      </div>
    </div>
  );
};
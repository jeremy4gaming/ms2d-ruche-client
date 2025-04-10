import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive as HiveIcon, Thermometer, Droplets, Scale, MapPin, Calendar } from 'lucide-react';
import { Hive } from '../types';

interface HiveCardProps {
  hive: Hive;
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
 * Affiche les informations essentielles
 * Cliquable pour accéder à la page de détail
 */
export const HiveCard: React.FC<HiveCardProps> = ({ hive }) => {
  const navigate = useNavigate();

  // Vérification que toutes les propriétés nécessaires sont présentes
  if (!hive || typeof hive !== 'object') {
    console.error("HiveCard: données de ruche invalides", hive);
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-red-500">Données de ruche non disponibles</p>
      </div>
    );
  }

  // Extraire les valeurs avec gestion des cas où les données seraient manquantes
  const {
    id = 'unknown',
    name = 'Ruche sans nom',
    location = 'Emplacement inconnu',
    health = 0,
    currentData = { temperature: 0, humidity: 0, weight: 0 },
    status = health >= 80 ? 'good' : health >= 60 ? 'warning' : 'danger',
    imageUrl,
    creationDate
  } = hive;

  // Extraire les valeurs des données actuelles, avec gestion des cas manquants
  const {
    temperature = 0,
    humidity = 0,
    weight = 0
  } = currentData || {};

  // Formater la date de création pour l'affichage
  const formattedCreationDate = creationDate 
    ? new Date(creationDate).toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    : 'Date inconnue';

  return (
    <div
      onClick={() => navigate(`/hive/${id}`)}
      className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform transition-transform hover:scale-105"
    >
      {/* En-tête avec nom, image, et indicateur d'état */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {/* Image de la ruche en format 50x50 ou icône par défaut */}
          <div className="w-[50px] h-[50px] rounded-lg overflow-hidden mr-3 flex-shrink-0">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                <HiveIcon className="w-6 h-6 text-amber-600" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">{name}</h3>
            {location && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>
        {/* Indicateur visuel d'état (vert, jaune, rouge) */}
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full ${statusColors[status] || 'bg-gray-500'} mr-2`} />
          <span className="text-sm">{health}%</span>
        </div>
      </div>

      {/* Grille des mesures principales */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Scale className="w-4 h-4 text-gray-600" />
          <span>{typeof weight === 'number' ? weight.toFixed(1) : '?'} kg</span>
        </div>
        <div className="flex items-center space-x-2">
          <Thermometer className="w-4 h-4 text-gray-600" />
          <span>{typeof temperature === 'number' ? temperature.toFixed(1) : '?'}°C</span>
        </div>
        <div className="flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-gray-600" />
          <span>{typeof humidity === 'number' ? humidity.toFixed(0) : '?'}%</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-600 justify-end">
          <Calendar className="w-3 h-3 text-gray-500" />
          <span>Création: {formattedCreationDate}</span>
        </div>
      </div>
    </div>
  );
};
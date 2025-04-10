import React from 'react';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Alert } from '../types';

interface AlertBadgeProps {
  alert: Alert;
  onClick?: () => void;
  hiveName?: string; // Ajout du nom de la ruche concernée, optionnel
}

/**
 * Couleurs associées aux différents niveaux de sévérité
 * Définit l'apparence visuelle du badge
 */
const severityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

/**
 * Icônes associées aux différents niveaux de sévérité
 */
const severityIcons = {
  low: Info,
  medium: AlertTriangle,
  high: AlertCircle
};

/**
 * Types d'alertes et leur label français
 */
const alertTypeLabels = {
  temperature: 'Température',
  humidity: 'Humidité',
  weight: 'Poids',
  activity: 'Activité'
};

/**
 * Badge d'alerte utilisé pour afficher les notifications
 * Couleur et icône varient selon la sévérité
 * Peut être cliquable pour ouvrir le détail de l'alerte
 * Affiche le nom de la ruche concernée si disponible
 */
export const AlertBadge: React.FC<AlertBadgeProps> = ({ alert, onClick, hiveName }) => {
  // Vérifier si l'alerte est valide
  if (!alert || typeof alert !== 'object') {
    console.error("AlertBadge: données d'alerte invalides", alert);
    return null;
  }

  // Vérifier si severity est une propriété valide de l'alerte
  const severity = alert.severity || 'medium';
  
  // Sélectionner l'icône appropriée avec une valeur par défaut
  const IconComponent = severityIcons[severity] || AlertTriangle;

  // Obtenir le label du type d'alerte
  const typeLabel = alert.type && alertTypeLabels[alert.type] ? alertTypeLabels[alert.type] : 'Alerte';

  // Styles améliorés pour mieux différencier les niveaux de sévérité
  const getSeverityStyles = () => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 ring-1 ring-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 ring-1 ring-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 ring-1 ring-gray-300';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`${getSeverityStyles()} flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm cursor-pointer transition shadow-sm hover:shadow-md`}
    >
      <IconComponent className="w-4 h-4 flex-shrink-0" />
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="font-medium mr-1">{typeLabel}:</span>
          <span>{alert.message}</span>
        </div>
        {/* Afficher le nom de la ruche uniquement si spécifié et s'il n'est pas déjà affiché ailleurs */}
        {hiveName && onClick && (
          <span className="text-xs opacity-80 font-medium">Ruche: {hiveName}</span>
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Alert } from '../types';

interface AlertBadgeProps {
  alert: Alert;
  onClick?: () => void;
}

const severityColors = {
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800'
};

const severityIcons = {
  info: Info,
  warning: AlertTriangle,
  danger: AlertTriangle
};

export const AlertBadge: React.FC<AlertBadgeProps> = ({ alert, onClick }) => {
  const Icon = severityIcons[alert.severity];

  return (
    <div
      onClick={onClick}
      className={`${severityColors[alert.severity]} flex items-center space-x-2 px-3 py-1 rounded-full text-sm cursor-pointer transition-transform hover:scale-105`}
    >
      <Icon className="w-4 h-4" />
      <span>{alert.message}</span>
    </div>
  );
};
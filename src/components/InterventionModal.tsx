import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Alert } from '../types';
import { ActionSelectionModal } from './ActionSelectionModal';
import { interventionTypes } from '../data';

interface InterventionModalProps {
  alert: Alert;
  onClose: () => void;
  onAction: (action: 'intervene' | 'ignore' | 'skip') => void;
}

/**
 * Modal permettant à l'apiculteur de gérer une alerte
 * Propose trois options: intervenir, ignorer ou reporter
 * Si "intervenir" est choisi, ouvre un second modal pour choisir l'action spécifique
 */
export const InterventionModal: React.FC<InterventionModalProps> = ({
  alert,
  onClose,
  onAction
}) => {
  // État pour gérer l'affichage du modal de sélection d'action
  const [showActionSelection, setShowActionSelection] = useState(false);

  // Gère le choix d'intervention
  const handleIntervene = () => {
    setShowActionSelection(true);
  };

  // Gère la sélection d'une action spécifique
  const handleActionSelect = (actionId: string) => {
    console.log('Action sélectionnée:', actionId);
    setShowActionSelection(false);
    onAction('intervene');
  };

  // Récupère les actions possibles pour ce type d'alerte
  const interventionType = interventionTypes.find(type => type.type === alert.type);

  return (
    <>
      {/* Premier modal: choix principal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Alerte détectée</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <p className="mb-6 text-gray-600">{alert.message}</p>

          {/* Boutons d'action */}
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleIntervene}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              ✅ Enregistrer une intervention
            </button>
            <button
              onClick={() => onAction('ignore')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              ❌ Ignorer
            </button>
            <button
              onClick={() => onAction('skip')}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              🔕 Ne rien faire
            </button>
          </div>
        </div>
      </div>

      {/* Second modal: sélection d'action spécifique si nécessaire */}
      {showActionSelection && interventionType && (
        <ActionSelectionModal
          actions={interventionType.actions}
          onClose={() => setShowActionSelection(false)}
          onSelect={handleActionSelect}
        />
      )}
    </>
  );
};
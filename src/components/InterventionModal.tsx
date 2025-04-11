import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Alert, InterventionAction } from '../types';
import { ActionSelectionModal } from './ActionSelectionModal';
import { interventionTypes } from '../data';
import { InterventionForm } from './InterventionForm';

interface InterventionModalProps {
  alert?: Alert; // Rendu optionnel pour permettre des interventions sans alerte
  hiveId: string; // ID de la ruche pour les interventions sans alerte
  onClose: () => void;
  onAction: (
    action: 'intervene' | 'ignore' | 'skip', 
    formData?: {
      actionId: string;
      notes: string;
      date: string;
      hiveId: string;
      alertId?: string;
      photoFiles?: File[];
    }
  ) => void;
  // Nouveau prop pour ouvrir directement le sélecteur d'action
  directActionSelection?: boolean;
}

/**
 * Modal permettant à l'apiculteur de gérer une alerte ou de déclencher une intervention
 * Propose des options différentes selon le contexte: alerte ou intervention manuelle
 */
export const InterventionModal: React.FC<InterventionModalProps> = ({
  alert,
  hiveId,
  onClose,
  onAction,
  directActionSelection = false
}) => {
  // État pour gérer les différentes étapes du flux
  const [showActionSelection, setShowActionSelection] = useState(directActionSelection);
  const [selectedAction, setSelectedAction] = useState<InterventionAction | null>(null);
  const [showInitialModal, setShowInitialModal] = useState(!directActionSelection);

  // Gère le choix d'intervention
  const handleIntervene = () => {
    setShowInitialModal(false);
    setShowActionSelection(true);
  };

  // Gère la sélection d'une action spécifique
  const handleActionSelect = (actionId: string) => {
    // Trouver l'action spécifique pour obtenir ses détails complets
    let selectedActionDetails: InterventionAction | null = null;
    
    for (const type of interventionTypes) {
      const action = type.actions.find(a => a.id === actionId);
      if (action) {
        selectedActionDetails = action;
        break;
      }
    }
    
    if (selectedActionDetails) {
      setSelectedAction(selectedActionDetails);
      setShowActionSelection(false);
    } else {
      console.error("Action non trouvée:", actionId);
    }
  };

  // Gère la soumission du formulaire d'intervention
  const handleFormSubmit = (formData: {
    actionId: string;
    notes: string;
    date: string;
    hiveId: string;
    alertId?: string;
    photoFiles?: File[];
  }) => {
    onAction('intervene', formData);
  };

  // Récupère les actions possibles pour ce type d'alerte ou toutes les actions
  // si c'est une intervention sans alerte
  const getAvailableInterventionTypes = () => {
    if (alert) {
      return interventionTypes.find(type => type.type === alert.type) || interventionTypes[0];
    }
    // Si pas d'alerte, on affiche toutes les actions disponibles, regroupées par type
    return {
      type: 'all',
      actions: interventionTypes.flatMap(type => type.actions)
    };
  };

  // Détermine quelles actions sont disponibles
  const interventionType = getAvailableInterventionTypes();

  return (
    <>
      {/* Première étape: Modal principal avec les options (seulement si pas en mode direct) */}
      {showInitialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-semibold">
                {alert ? "Alerte détectée" : "Nouvelle intervention"}
              </h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {alert && <p className="mb-4 sm:mb-6 text-gray-600">{alert.message}</p>}
            {!alert && (
              <p className="mb-4 sm:mb-6 text-gray-600">
                Enregistrez une nouvelle intervention pour cette ruche.
              </p>
            )}

            {/* Boutons d'action - empilés sur mobile */}
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              <button
                onClick={handleIntervene}
                className="bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                ✅ Enregistrer une intervention
              </button>
              
              {/* Ces boutons n'apparaissent que s'il y a une alerte */}
              {alert && (
                <>
                  <button
                    onClick={() => onAction('ignore')}
                    className="bg-red-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    ❌ Ignorer Définitivement
                  </button>
                  <button
                    onClick={() => onAction('skip')}
                    className="bg-gray-200 text-gray-800 px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    ⏳ Ne rien faire
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Deuxième étape: Sélection d'action spécifique */}
      {showActionSelection && interventionType && (
        <ActionSelectionModal
          actions={interventionType.actions}
          onClose={() => {
            setShowActionSelection(false);
            // Si on est en mode direct et qu'on ferme cette popup, fermer complètement le modal
            if (directActionSelection) {
              onClose();
            } else {
              // Sinon revenir au modal initial
              setShowInitialModal(true);
            }
          }}
          onSelect={handleActionSelect}
        />
      )}

      {/* Troisième étape: Formulaire d'intervention */}
      {selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Détails de l'intervention</h3>
              <button 
                onClick={() => {
                  setSelectedAction(null);
                  // Si on est en mode direct, revenir à la sélection d'action
                  if (directActionSelection) {
                    setShowActionSelection(true);
                  } else {
                    // Sinon revenir au modal initial
                    setShowInitialModal(true);
                  }
                }} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <InterventionForm
              selectedAction={selectedAction}
              alert={alert}
              hiveId={hiveId}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setSelectedAction(null);
                // Si on est en mode direct, revenir à la sélection d'action
                if (directActionSelection) {
                  setShowActionSelection(true);
                } else {
                  // Sinon revenir au modal initial
                  setShowInitialModal(true);
                }
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
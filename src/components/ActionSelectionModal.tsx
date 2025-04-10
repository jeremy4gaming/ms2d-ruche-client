import React from 'react';
import { X } from 'lucide-react';
import { InterventionAction } from '../types';

interface ActionSelectionModalProps {
  actions: InterventionAction[];
  onClose: () => void;
  onSelect: (actionId: string) => void;
}

export const ActionSelectionModal: React.FC<ActionSelectionModalProps> = ({
  actions,
  onClose,
  onSelect
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Sélectionner une action</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {actions.map(action => (
            <button
              key={action.id}
              onClick={() => onSelect(action.id)}
              className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors flex items-center space-x-4"
            >
              <span className="text-2xl">{action.icon}</span>
              <div className="text-left">
                <h4 className="font-medium">{action.label}</h4>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
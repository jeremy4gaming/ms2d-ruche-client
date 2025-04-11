import React, { useState, useRef } from 'react';
import { Image, Upload, X, Plus } from 'lucide-react';
import { InterventionAction, Alert } from '../types';

interface InterventionFormProps {
  selectedAction: InterventionAction;
  alert?: Alert;
  hiveId: string;
  onSubmit: (formData: {
    actionId: string;
    notes: string;
    date: string;
    hiveId: string;
    alertId?: string;
    photoFiles?: File[];
  }) => void;
  onCancel: () => void;
}

interface PhotoPreview {
  id: string;
  file: File;
  preview: string;
}

/**
 * Formulaire détaillé pour enregistrer une intervention de l'apiculteur
 * Permet de saisir des notes, la date et d'ajouter plusieurs photos
 */
export const InterventionForm: React.FC<InterventionFormProps> = ({
  selectedAction,
  alert,
  hiveId,
  onSubmit,
  onCancel
}) => {
  // Référence pour l'input de fichier
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    notes: '',
    date: new Date().toISOString().split('T')[0], // Date du jour par défaut au format YYYY-MM-DD
  });
  
  // État pour gérer les aperçus et fichiers des images
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  
  // Limite maximum de photos
  const MAX_PHOTOS = 5;

  // Mise à jour des champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gestion de la sélection de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Vérifier si la limite de photos n'est pas dépassée
    if (photos.length + files.length > MAX_PHOTOS) {
      alert(`Vous ne pouvez pas ajouter plus de ${MAX_PHOTOS} photos.`);
      return;
    }
    
    // Traiter chaque fichier sélectionné
    Array.from(files).forEach(file => {
      // Vérifier le type et la taille du fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner uniquement des images.');
        return;
      }
      
      // Limite de taille à 5MB par photo
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille de chaque image ne doit pas dépasser 5MB.');
        return;
      }
      
      // Créer un identifiant unique
      const photoId = `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, {
          id: photoId,
          file: file,
          preview: reader.result as string
        }]);
      };
      reader.readAsDataURL(file);
    });
    
    // Réinitialiser l'input de fichier pour permettre de sélectionner à nouveau les mêmes fichiers
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Supprimer une photo
  const handleRemovePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  // Déclencher l'input de fichier
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      actionId: selectedAction.id,
      notes: formData.notes,
      date: formData.date,
      hiveId: hiveId,
      alertId: alert?.id,
      photoFiles: photos.length > 0 ? photos.map(photo => photo.file) : undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* En-tête avec l'action sélectionnée */}
      <div className="mb-6 pb-3 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{selectedAction.icon}</span>
          <div>
            <h3 className="text-lg font-medium">{selectedAction.label}</h3>
            <p className="text-sm text-gray-600">{selectedAction.description}</p>
          </div>
        </div>
        
        {alert && (
          <div className="mt-3 p-2 bg-yellow-50 rounded-md text-sm">
            <p className="font-medium text-yellow-800">En réponse à l'alerte: {alert.message}</p>
          </div>
        )}
      </div>

      {/* Date de l'intervention */}
      <div className="space-y-2">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date de l'intervention
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Section d'upload de photos */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            Photos de l'intervention
          </label>
          <span className="text-xs text-gray-500">
            {photos.length}/{MAX_PHOTOS} photos
          </span>
        </div>
        
        {/* Grille d'aperçu des photos */}
        {photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {photos.map(photo => (
              <div key={photo.id} className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
                <img 
                  src={photo.preview} 
                  alt="Aperçu de la photo" 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(photo.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {/* Bouton pour ajouter plus de photos si moins que le maximum */}
            {photos.length < MAX_PHOTOS && (
              <div 
                onClick={handleUploadClick}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-8 h-8 text-gray-400 mb-1" />
                <p className="text-xs text-gray-500">Ajouter</p>
              </div>
            )}
          </div>
        )}
        
        {/* Zone d'upload initiale, montrée seulement s'il n'y a pas de photos */}
        {photos.length === 0 && (
          <div 
            onClick={handleUploadClick}
            className="w-full h-36 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <Image className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Cliquez pour ajouter des photos</p>
            <p className="text-xs text-gray-400 mt-1">Jusqu'à {MAX_PHOTOS} photos (JPG, PNG ou GIF - max 5MB chacune)</p>
          </div>
        )}
        
        {/* Input caché pour la sélection de fichier */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
      </div>

      {/* Notes d'intervention */}
      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes d'intervention
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          placeholder="Décrivez votre intervention, les observations, etc."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end space-x-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Enregistrer l'intervention
        </button>
      </div>
    </form>
  );
};

import { Hive, Alert, TimeSeriesData } from '../types';

/**
 * URL de base de l'API
 * En développement, utilise le proxy configuré dans vite.config.ts
 * En production, utiliserait l'URL complète du serveur
 */
const API_BASE_URL = '/api';

// Fonction utilitaire pour gérer les réponses d'API et les erreurs
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // Tentative de récupération du message d'erreur
    let errorMessage = `Erreur ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      console.warn("Impossible de parser le message d'erreur:", e);
    }
    
    console.error(`Erreur API (${response.status}):`, errorMessage);
    throw new Error(errorMessage);
  }
  
  // Tenter de parser la réponse JSON
  try {
    return await response.json();
  } catch (e) {
    console.error("Erreur lors du parsing de la réponse JSON:", e);
    throw new Error("Format de réponse invalide");
  }
};

/**
 * Récupère la liste de toutes les ruches
 * Utilisé sur la page d'accueil pour afficher les cartes de ruches
 */
export const getHives = async (): Promise<Hive[]> => {
  try {
    console.log("Appel API: récupération des ruches");
    const response = await fetch(`${API_BASE_URL}/hives`);
    const data = await handleResponse(response);
    console.log("Données ruches reçues:", data);
    return data;
  } catch (error) {
    console.error("Erreur getHives:", error);
    throw error;
  }
};

/**
 * Récupère les détails d'une ruche spécifique
 * Utilisé sur la page de détail d'une ruche
 * @param id Identifiant unique de la ruche
 */
export const getHive = async (id: string): Promise<Hive> => {
  try {
    console.log(`Appel API: récupération de la ruche ${id}`);
    const response = await fetch(`${API_BASE_URL}/hives/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Erreur getHive(${id}):`, error);
    throw error;
  }
};

/**
 * Récupère toutes les alertes
 * Peut être filtré par ruche spécifique
 * @param hiveId Optionnel : filtrer les alertes pour une ruche spécifique
 */
export const getAlerts = async (hiveId?: string): Promise<Alert[]> => {
  try {
    const url = hiveId 
      ? `${API_BASE_URL}/alerts?hiveId=${hiveId}`
      : `${API_BASE_URL}/alerts`;
    
    console.log(`Appel API: récupération des alertes${hiveId ? ` pour la ruche ${hiveId}` : ''}`);
    const response = await fetch(url);
    const data = await handleResponse(response);
    console.log("Données alertes reçues:", data);
    return data;
  } catch (error) {
    console.error(`Erreur getAlerts(${hiveId || 'all'}):`, error);
    throw error;
  }
};

/**
 * Récupère les données historiques d'une ruche pour générer les graphiques
 * @param hiveId Identifiant de la ruche
 * @param type Type de donnée (poids, température, humidité)
 * @param timeRange Période (jour, semaine, mois, année)
 */
export const getHiveData = async (
  hiveId: string,
  type: 'weight' | 'temperature' | 'humidity',
  timeRange: 'day' | 'week' | 'month' | 'year'
): Promise<TimeSeriesData[]> => {
  const response = await fetch(
    `${API_BASE_URL}/hives/${hiveId}/data?type=${type}&timeRange=${timeRange}`
  );
  return handleResponse(response);
};

/**
 * Interface pour les données d'intervention envoyées à l'API
 */
interface InterventionData {
  hiveId: string;
  actionId: string;
  alertId?: string;
  notes?: string;
  date?: string;
  photoFiles?: File[];
}

/**
 * Enregistre une nouvelle intervention sur une ruche
 * Appelé quand l'apiculteur réalise une action suite à une alerte
 * @param interventionData Données complètes de l'intervention
 */
export const createIntervention = async (
  interventionData: InterventionData
): Promise<void> => {
  // Si des photos sont présentes, utiliser FormData pour l'upload
  if (interventionData.photoFiles && interventionData.photoFiles.length > 0) {
    const formData = new FormData();
    
    // Ajouter tous les champs à FormData
    formData.append('hiveId', interventionData.hiveId);
    formData.append('actionId', interventionData.actionId);
    
    if (interventionData.alertId) {
      formData.append('alertId', interventionData.alertId);
    }
    
    if (interventionData.notes) {
      formData.append('notes', interventionData.notes);
    }
    
    if (interventionData.date) {
      formData.append('date', interventionData.date);
    }
    
    // Ajouter les fichiers photo avec un indice pour les identifier
    interventionData.photoFiles.forEach((file, index) => {
      formData.append(`photos[${index}]`, file);
    });
    
    const response = await fetch(`${API_BASE_URL}/interventions`, {
      method: 'POST',
      body: formData,
      // Ne pas définir Content-Type, le navigateur le fera automatiquement avec boundary
    });
    
    return handleResponse(response);
  } else {
    // Cas sans photo: utiliser JSON comme avant
    const { photoFiles, ...dataWithoutPhotos } = interventionData; // Supprimer la propriété photoFiles
    
    const response = await fetch(`${API_BASE_URL}/interventions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataWithoutPhotos),
    });
    
    return handleResponse(response);
  }
};

/**
 * Récupère les prévisions météo pour un emplacement
 * @param location Nom de l'emplacement
 */
export const getWeatherForecast = async (location: string): Promise<any> => {
  try {
    console.log(`Appel API: récupération des prévisions météo pour ${location}`);
    const response = await fetch(`${API_BASE_URL}/weather?location=${encodeURIComponent(location)}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Erreur getWeatherForecast(${location}):`, error);
    throw error;
  }
};
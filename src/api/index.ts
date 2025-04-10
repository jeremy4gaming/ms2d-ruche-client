import { Hive, Alert, TimeSeriesData } from '../types';

/**
 * URL de base de l'API - À modifier selon l'environnement
 * Production, développement, etc.
 */
const API_BASE_URL = '/api';

/**
 * Récupère la liste de toutes les ruches
 * Utilisé sur la page d'accueil pour afficher les cartes de ruches
 */
export const getHives = async (): Promise<Hive[]> => {
  const response = await fetch(`${API_BASE_URL}/hives`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des ruches');
  return response.json();
};

/**
 * Récupère les détails d'une ruche spécifique
 * Utilisé sur la page de détail d'une ruche
 * @param id Identifiant unique de la ruche
 */
export const getHive = async (id: string): Promise<Hive> => {
  const response = await fetch(`${API_BASE_URL}/hives/${id}`);
  if (!response.ok) throw new Error('Erreur lors de la récupération de la ruche');
  return response.json();
};

/**
 * Récupère toutes les alertes
 * Peut être filtré par ruche spécifique
 * @param hiveId Optionnel : filtrer les alertes pour une ruche spécifique
 */
export const getAlerts = async (hiveId?: string): Promise<Alert[]> => {
  const url = hiveId 
    ? `${API_BASE_URL}/alerts?hiveId=${hiveId}`
    : `${API_BASE_URL}/alerts`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Erreur lors de la récupération des alertes');
  return response.json();
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
  if (!response.ok) throw new Error('Erreur lors de la récupération des données');
  return response.json();
};

/**
 * Enregistre une nouvelle intervention sur une ruche
 * Appelé quand l'apiculteur réalise une action suite à une alerte
 * @param hiveId Identifiant de la ruche 
 * @param actionId Action réalisée
 * @param alertId Alerte concernée
 */
export const createIntervention = async (
  hiveId: string,
  actionId: string,
  alertId: string
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/interventions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ hiveId, actionId, alertId }),
  });
  if (!response.ok) throw new Error('Erreur lors de l\'enregistrement de l\'intervention');
};
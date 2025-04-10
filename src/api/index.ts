import { Hive, Alert, TimeSeriesData } from '../types';

/**
 * URL de base de l'API
 */
const API_BASE_URL = '/api';

/**
 * Récupère la liste de toutes les ruches
 */
export const getHives = async (): Promise<Hive[]> => {
  const response = await fetch(`${API_BASE_URL}/hives`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des ruches');
  return response.json();
};

/**
 * Récupère les détails d'une ruche spécifique
 */
export const getHive = async (id: string): Promise<Hive> => {
  const response = await fetch(`${API_BASE_URL}/hives/${id}`);
  if (!response.ok) throw new Error('Erreur lors de la récupération de la ruche');
  return response.json();
};

/**
 * Récupère toutes les alertes
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
 * Récupère les données historiques d'une ruche
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
 * Enregistre une nouvelle intervention
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
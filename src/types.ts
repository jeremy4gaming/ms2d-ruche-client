/**
 * Interface représentant une ruche avec ses caractéristiques
 * et ses mesures actuelles
 */
export interface Hive {
  id: string;
  name: string;
  weight: number;       // Poids actuel en kg
  temperature: number;  // Température interne en °C
  humidity: number;     // Taux d'humidité en %
  status: 'good' | 'warning' | 'danger';  // État global de santé
  creationYear: number; // Année de création de la ruche
  supers: number;       // Nombre de hausses actuellement installées
}

/**
 * Interface décrivant une alerte générée par le système
 * de surveillance des ruches
 */
export interface Alert {
  id: string;
  hiveId: string;  // ID de la ruche concernée
  type: 'weight' | 'temperature' | 'humidity' | 'activity';  // Type de mesure concernée
  severity: 'info' | 'warning' | 'danger';  // Niveau de gravité
  message: string;  // Message explicatif
  timestamp: Date;  // Date et heure de détection
}

/**
 * Structure de données pour les séries temporelles utilisées
 * dans les graphiques de suivi
 */
export interface TimeSeriesData {
  timestamp: string;  // Date au format ISO
  value: number;      // Valeur mesurée
}

/**
 * Action d'intervention possible en réponse à une alerte
 */
export interface InterventionAction {
  id: string;
  label: string;       // Nom court de l'action
  description: string; // Description détaillée
  icon: string;        // Emoji ou identifiant d'icône
}

/**
 * Regroupement des actions possibles par type d'alerte
 */
export interface InterventionType {
  type: Alert['type'];     // Type d'alerte concerné
  actions: InterventionAction[]; // Liste des actions possibles
}
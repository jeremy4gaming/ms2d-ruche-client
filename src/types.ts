/**
 * Interface représentant une ruche avec ses caractéristiques
 * et ses mesures actuelles
 */
export interface Hive {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  health: number;
  currentData: {
    temperature: number;
    humidity: number;
    weight: number;
  };
  creationDate: string;  // Date complète de création au format ISO
  // Propriétés optionnelles pour la compatibilité avec le code existant
  status?: 'good' | 'warning' | 'danger';
  creationYear?: number;
  supers?: number;
}

/**
 * Interface décrivant une alerte générée par le système
 * de surveillance des ruches
 */
export interface Alert {
  id: string;
  hiveId: string;  // ID de la ruche concernée
  type: 'temperature' | 'humidity' | 'weight' | 'activity';  // Type de mesure concernée
  severity: 'low' | 'medium' | 'high';  // Niveau de gravité
  message: string;  // Message explicatif
  createdAt: string;  // Date au format ISO
  resolved: boolean;  // Indique si l'alerte a été résolue
  // Propriété pour la compatibilité avec le code existant
  timestamp?: Date;
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

/**
 * Intervention réalisée sur une ruche
 */
export interface Intervention {
  id: string;
  hiveId: string;      // ID de la ruche concernée
  actionId: string;    // ID de l'action réalisée
  alertId: string;     // ID de l'alerte liée
  timestamp: string;   // Date et heure de l'intervention
  notes: string;       // Notes complémentaires
}
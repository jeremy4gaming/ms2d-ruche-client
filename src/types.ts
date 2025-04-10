export interface Hive {
  id: string;
  name: string;
  weight: number;
  temperature: number;
  humidity: number;
  status: 'good' | 'warning' | 'danger';
  creationYear: number;
  supers: number;
}

export interface Alert {
  id: string;
  hiveId: string;
  type: 'weight' | 'temperature' | 'humidity' | 'activity';
  severity: 'info' | 'warning' | 'danger';
  message: string;
  timestamp: Date;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface InterventionAction {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface InterventionType {
  type: Alert['type'];
  actions: InterventionAction[];
}
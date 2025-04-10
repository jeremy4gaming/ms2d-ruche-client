import { Hive, Alert, TimeSeriesData, InterventionType } from './types';

export const mockHives: Hive[] = [
  {
    id: '1',
    name: 'Ruche Lavande',
    weight: 25.5,
    temperature: 35,
    humidity: 65,
    status: 'good',
    creationYear: 2022,
    supers: 2
  },
  {
    id: '2',
    name: 'Ruche Romarin',
    weight: 30.2,
    temperature: 38,
    humidity: 70,
    status: 'warning',
    creationYear: 2023,
    supers: 1
  },
  {
    id: '3',
    name: 'Ruche Thym',
    weight: 28.7,
    temperature: 34,
    humidity: 68,
    status: 'good',
    creationYear: 2021,
    supers: 3
  },
  {
    id: '4',
    name: 'Ruche Acacia',
    weight: 22.3,
    temperature: 36,
    humidity: 62,
    status: 'danger',
    creationYear: 2022,
    supers: 2
  },
  {
    id: '5',
    name: 'Ruche Tilleul',
    weight: 27.8,
    temperature: 35,
    humidity: 66,
    status: 'good',
    creationYear: 2023,
    supers: 2
  },
  {
    id: '6',
    name: 'Ruche Châtaignier',
    weight: 29.1,
    temperature: 37,
    humidity: 69,
    status: 'warning',
    creationYear: 2021,
    supers: 3
  }
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    hiveId: '2',
    type: 'temperature',
    severity: 'warning',
    message: 'Température élevée détectée',
    timestamp: new Date()
  },
  {
    id: '2',
    hiveId: '4',
    type: 'weight',
    severity: 'danger',
    message: 'Perte de poids soudaine',
    timestamp: new Date()
  },
  {
    id: '3',
    hiveId: '6',
    type: 'humidity',
    severity: 'warning',
    message: 'Humidité anormale',
    timestamp: new Date()
  }
];

export const interventionTypes: InterventionType[] = [
  {
    type: 'weight',
    actions: [
      {
        id: 'add-super',
        label: 'Ajout de hausse',
        description: 'Ajouter une nouvelle hausse à la ruche',
        icon: '📦'
      },
      {
        id: 'remove-super',
        label: 'Retrait de hausse',
        description: 'Retirer une hausse de la ruche',
        icon: '🔄'
      },
      {
        id: 'harvest',
        label: 'Récolte de miel',
        description: 'Procéder à la récolte du miel',
        icon: '🍯'
      }
    ]
  },
  {
    type: 'temperature',
    actions: [
      {
        id: 'ventilation',
        label: 'Améliorer la ventilation',
        description: 'Ajuster les ouvertures pour une meilleure circulation d\'air',
        icon: '💨'
      },
      {
        id: 'isolation',
        label: 'Renforcer l\'isolation',
        description: 'Ajouter une protection thermique',
        icon: '🏠'
      }
    ]
  },
  {
    type: 'humidity',
    actions: [
      {
        id: 'drainage',
        label: 'Drainage',
        description: 'Améliorer le drainage autour de la ruche',
        icon: '💧'
      },
      {
        id: 'ventilation',
        label: 'Ventilation',
        description: 'Ajuster la ventilation pour réduire l\'humidité',
        icon: '🌪️'
      }
    ]
  }
];

export const generateTimeSeriesData = (days: number, type: 'weight' | 'temperature' | 'humidity'): TimeSeriesData[] => {
  const data = [];
  const now = new Date();
  
  const ranges = {
    weight: { min: 20, max: 35 },
    temperature: { min: 30, max: 40 },
    humidity: { min: 55, max: 75 }
  };
  
  const range = ranges[type];
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      timestamp: date.toISOString().split('T')[0],
      value: range.min + Math.random() * (range.max - range.min)
    });
  }
  
  return data;
};
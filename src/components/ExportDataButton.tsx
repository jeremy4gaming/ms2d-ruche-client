import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { Hive, TimeSeriesData } from '../types';

interface ExportDataButtonProps {
  hive: Hive;
  timeSeriesData: {
    weight: TimeSeriesData[];
    temperature: TimeSeriesData[];
    humidity: TimeSeriesData[];
  };
  timeRange: 'day' | 'week' | 'month' | 'year';
}

/**
 * Composant bouton pour exporter les données de la ruche au format CSV
 */
export const ExportDataButton: React.FC<ExportDataButtonProps> = ({ 
  hive, 
  timeSeriesData,
  timeRange
}) => {
  // Convertir les données en format CSV et initier le téléchargement
  const exportAsCSV = () => {
    try {
      // Préparer les en-têtes
      const headers = ['Date', 'Poids (kg)', 'Température (°C)', 'Humidité (%)'];
      
      // Combiner toutes les données par date
      const combinedData: Record<string, Record<string, string | number>> = {};
      
      // Ajouter les données de poids
      timeSeriesData.weight.forEach(item => {
        const date = new Date(item.timestamp).toISOString().split('T')[0];
        if (!combinedData[date]) {
          combinedData[date] = { Date: date };
        }
        combinedData[date]['Poids (kg)'] = Number(item.value).toFixed(2);
      });
      
      // Ajouter les données de température
      timeSeriesData.temperature.forEach(item => {
        const date = new Date(item.timestamp).toISOString().split('T')[0];
        if (!combinedData[date]) {
          combinedData[date] = { Date: date };
        }
        combinedData[date]['Température (°C)'] = Number(item.value).toFixed(1);
      });
      
      // Ajouter les données d'humidité
      timeSeriesData.humidity.forEach(item => {
        const date = new Date(item.timestamp).toISOString().split('T')[0];
        if (!combinedData[date]) {
          combinedData[date] = { Date: date };
        }
        combinedData[date]['Humidité (%)'] = Number(item.value).toFixed(0);
      });
      
      // Convertir en tableau pour trier par date
      const sortedData = Object.values(combinedData).sort((a, b) => 
        String(a.Date).localeCompare(String(b.Date))
      );
      
      // Construire le contenu CSV
      let csvContent = headers.join(',') + '\n';
      
      sortedData.forEach(row => {
        const csvRow = headers.map(header => {
          return row[header] !== undefined ? row[header] : '';
        }).join(',');
        csvContent += csvRow + '\n';
      });
      
      // Créer et télécharger le fichier
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${hive.name.replace(/\s+/g, '_')}_${timeRange}_data.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erreur lors de l'exportation CSV:", error);
      alert("Une erreur est survenue lors de l'exportation. Veuillez réessayer.");
    }
  };

  return (
    <button
      onClick={exportAsCSV}
      className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
    >
      <FileSpreadsheet className="w-5 h-5" />
      <span>Exporter en CSV</span>
      <Download className="w-4 h-4" />
    </button>
  );
};

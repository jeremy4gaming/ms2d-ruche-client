import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, CloudSnow, CloudFog, CloudLightning } from 'lucide-react';

interface WeatherDay {
  date: string;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'foggy' | 'stormy';
  precipitationChance: number;
}

interface WeatherForecastProps {
  location: string;
}

// Mapping des icônes météo selon les conditions
const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
  foggy: CloudFog,
  stormy: CloudLightning
};

// Couleurs associées aux conditions météo
const weatherColors = {
  sunny: 'text-yellow-500',
  cloudy: 'text-gray-500',
  rainy: 'text-blue-500',
  snowy: 'text-blue-200',
  foggy: 'text-gray-400',
  stormy: 'text-purple-500'
};

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ location }) => {
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);

        // Normalement ici, vous feriez un appel à une API météo avec l'emplacement
        // Pour cet exemple, nous générons des données aléatoires
        const mockForecast = generateMockWeather(location);
        
        setForecast(mockForecast);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des données météo:", err);
        setError("Impossible de charger les prévisions météo");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  // Génère des données météo aléatoires pour la démo
  const generateMockWeather = (location: string): WeatherDay[] => {
    const conditions: Array<'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'foggy' | 'stormy'> = 
      ['sunny', 'cloudy', 'rainy', 'snowy', 'foggy', 'stormy'];
    
    // Utiliser la localisation comme graine pour le générateur
    // pour obtenir des données cohérentes pour chaque lieu
    const locationSeed = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);

      // Pseudo-aléatoire basé sur le lieu et la date
      const seed = locationSeed + i;
      const random = () => ((seed * 9301 + 49297) % 233280) / 233280;
      
      const conditionIndex = Math.floor(random() * conditions.length);
      const temperature = Math.round(15 + random() * 20);
      const precipitationChance = Math.round(random() * 100);

      return {
        date: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
        temperature,
        condition: conditions[conditionIndex],
        precipitationChance
      };
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 text-center">
        <p className="text-gray-500">Chargement des prévisions météo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex items-center mb-3">
        <h3 className="text-lg font-medium">Météo à {location}</h3>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {forecast.map((day, index) => {
          const WeatherIcon = weatherIcons[day.condition];
          const colorClass = weatherColors[day.condition];
          
          return (
            <div key={index} className="text-center">
              <div className="text-sm font-medium">{day.date}</div>
              <div className={`flex justify-center my-2 ${colorClass}`}>
                <WeatherIcon className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold">{day.temperature}°C</div>
              <div className="text-xs text-gray-500">{day.precipitationChance}% 💧</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

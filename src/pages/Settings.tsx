import React, { useState } from 'react';
import { Save, Settings as SettingsIcon, BellRing, Gauge, Clock, RefreshCw, MailWarning, Smartphone, Database, MapPin, AlertTriangle, Thermometer, Droplets, Scale, Globe } from 'lucide-react';

/**
 * Page de paramètres permettant à l'apiculteur de configurer l'application
 * selon ses besoins spécifiques
 */
const Settings: React.FC = () => {
  // États pour les différents paramètres
  const [sensorFrequency, setSensorFrequency] = useState<number>(15);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [smsNotifications, setSmsNotifications] = useState<boolean>(false);
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [dataRetention, setDataRetention] = useState<number>(12);
  const [updatingSettings, setUpdatingSettings] = useState<boolean>(false);
  const [locationTracking, setLocationTracking] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<'general' | 'notifications' | 'data' | 'thresholds' | 'language'>('general');
  const [language, setLanguage] = useState<'fr' | 'en' | 'es' | 'de'>('fr');
  
  // États pour les seuils d'alertes
  const [temperatureThresholds, setTemperatureThresholds] = useState({
    lowCritical: 5,
    lowWarning: 15,
    highWarning: 35,
    highCritical: 40
  });
  const [humidityThresholds, setHumidityThresholds] = useState({
    lowCritical: 30,
    lowWarning: 40,
    highWarning: 70,
    highCritical: 85
  });
  const [weightThresholds, setWeightThresholds] = useState({
    lowWarningPercent: 15,  // Pourcentage de baisse soudaine qui déclenche une alerte
    highWarningPercent: 20  // Pourcentage d'augmentation soudaine qui déclenche une alerte
  });

  // Liste des langues disponibles avec leurs noms localisés
  const availableLanguages = [
    { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'Anglais', nativeName: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Espagnol', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Allemand', nativeName: 'Deutsch', flag: '🇩🇪' }
  ];

  // Fonction pour enregistrer les paramètres
  const saveSettings = () => {
    setUpdatingSettings(true);
    
    // Simulation d'un appel API pour enregistrer les paramètres
    setTimeout(() => {
      setUpdatingSettings(false);
      alert('Paramètres enregistrés avec succès !');
      
      // Dans une application réelle, on appellerait une API ici
      // saveUserSettings({ sensorFrequency, notificationsEnabled, ... })
    }, 1000);
  };

  // Gestionnaires pour mettre à jour les seuils
  const handleTemperatureThresholdChange = (key: keyof typeof temperatureThresholds, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setTemperatureThresholds(prev => ({ ...prev, [key]: numValue }));
    }
  };

  const handleHumidityThresholdChange = (key: keyof typeof humidityThresholds, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setHumidityThresholds(prev => ({ ...prev, [key]: numValue }));
    }
  };

  const handleWeightThresholdChange = (key: keyof typeof weightThresholds, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setWeightThresholds(prev => ({ ...prev, [key]: numValue }));
    }
  };

  // Fonction pour gérer le changement de langue
  const handleLanguageChange = (langCode: 'fr' | 'en' | 'es' | 'de') => {
    setLanguage(langCode);
    // En production, on mettrait à jour la langue de l'application ici
    // Ex: i18n.changeLanguage(langCode);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Tabs de navigation - version scrollable sur mobile */}
        <div className="mb-6 border-b border-gray-200 overflow-x-auto scrollbar-hide">
          <nav className="flex space-x-4 pb-1">
            <button
              onClick={() => setCurrentTab('general')}
              className={`py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
                currentTab === 'general' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Général
            </button>
            <button
              onClick={() => setCurrentTab('language')}
              className={`py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
                currentTab === 'language' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Langue
            </button>
            <button
              onClick={() => setCurrentTab('thresholds')}
              className={`py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
                currentTab === 'thresholds' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Seuils d'alertes
            </button>
            <button
              onClick={() => setCurrentTab('notifications')}
              className={`py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
                currentTab === 'notifications' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setCurrentTab('data')}
              className={`py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
                currentTab === 'data' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Données et stockage
            </button>
          </nav>
        </div>
        
        {/* Section des paramètres généraux - adaptée pour mobile */}
        {currentTab === 'general' && (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Paramètres généraux</h2>
            
            <div className="space-y-6">
              {/* Fréquence de réception des données des capteurs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="sensor-frequency" className="flex items-center space-x-2 text-gray-700">
                    <RefreshCw className="w-5 h-5 text-gray-500" />
                    <span>Fréquence de réception des données</span>
                  </label>
                  <span className="text-sm font-medium text-blue-600">{sensorFrequency} minutes</span>
                </div>
                <input
                  id="sensor-frequency"
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={sensorFrequency}
                  onChange={(e) => setSensorFrequency(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5 min</span>
                  <span>60 min</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Les données sont collectées et envoyées toutes les {sensorFrequency} minutes. 
                  Une fréquence plus élevée permet un suivi plus précis mais consomme plus de batterie.
                </p>
              </div>
              
              {/* Unités de mesure - optimisé pour mobile */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-lg font-medium mb-3">Unités de mesure</h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Unité de température */}
                  <div>
                    <label className="flex items-center mb-2 space-x-2 text-gray-700">
                      <Gauge className="w-5 h-5 text-gray-500" />
                      <span>Unité de température</span>
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setTemperatureUnit('celsius')}
                        className={`flex-1 py-2 border rounded-md ${
                          temperatureUnit === 'celsius'
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Celsius (°C)
                      </button>
                      <button
                        onClick={() => setTemperatureUnit('fahrenheit')}
                        className={`flex-1 py-2 border rounded-md ${
                          temperatureUnit === 'fahrenheit'
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Fahrenheit (°F)
                      </button>
                    </div>
                  </div>
                  
                  {/* Unité de poids */}
                  <div>
                    <label className="flex items-center mb-2 space-x-2 text-gray-700">
                      <Gauge className="w-5 h-5 text-gray-500" />
                      <span>Unité de poids</span>
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setWeightUnit('kg')}
                        className={`flex-1 py-2 border rounded-md ${
                          weightUnit === 'kg'
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Kilogrammes (kg)
                      </button>
                      <button
                        onClick={() => setWeightUnit('lb')}
                        className={`flex-1 py-2 border rounded-md ${
                          weightUnit === 'lb'
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Livres (lb)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Géolocalisation */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-gray-700">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span>Suivi de la géolocalisation des ruches</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={locationTracking}
                      onChange={() => setLocationTracking(!locationTracking)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Permet de suivre la position GPS des ruches et d'afficher les données météo locales.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Section de gestion de la langue */}
        {currentTab === 'language' && (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-500" />
              Langue de l'application
            </h2>
            
            <p className="text-gray-600 mb-6">
              Choisissez la langue dans laquelle vous souhaitez utiliser l'application. Cette option modifiera tous les textes de l'interface.
            </p>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {availableLanguages.map((lang) => (
                <div key={lang.code} className="relative">
                  <button
                    onClick={() => handleLanguageChange(lang.code as 'fr' | 'en' | 'es' | 'de')}
                    className={`w-full flex items-center p-4 border ${
                      language === lang.code 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    } rounded-lg transition-colors`}
                  >
                    <span className="text-2xl mr-3">{lang.flag}</span>
                    <div className="text-left">
                      <div className="font-medium">{lang.name}</div>
                      <div className="text-sm text-gray-500">{lang.nativeName}</div>
                    </div>
                  </button>
                  
                  {language === lang.code && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium mb-3">Format de date et d'heure</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Format de date
                  </label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option value="dd/mm/yyyy">JJ/MM/AAAA (31/12/2023)</option>
                    <option value="mm/dd/yyyy">MM/JJ/AAAA (12/31/2023)</option>
                    <option value="yyyy-mm-dd">AAAA-MM-JJ (2023-12-31)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Format d'heure
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="timeFormat" 
                        value="24h" 
                        defaultChecked
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">24 heures (14:30)</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="timeFormat" 
                        value="12h"
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">12 heures (2:30 PM)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Note sur la langue</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Après le changement de langue, il peut être nécessaire de recharger l'application pour que tous les éléments soient correctement traduits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Section des seuils d'alertes */}
        {currentTab === 'thresholds' && (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
              Seuils d'alertes
            </h2>
            <p className="text-gray-600 mb-6">
              Configurez les seuils à partir desquels les alertes seront déclenchées pour chaque type de mesure.
            </p>
            
            {/* Seuils de température - adapté pour mobile */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Thermometer className="w-5 h-5 text-red-500 mr-2" />
                <h3 className="text-lg font-medium">Température</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="temp-low-critical" className="text-sm font-medium text-gray-700">
                      Seuil critique bas
                    </label>
                    <span className="text-sm font-medium text-blue-600">{temperatureThresholds.lowCritical}°C</span>
                  </div>
                  <input
                    id="temp-low-critical"
                    type="range"
                    min="-10"
                    max="20"
                    value={temperatureThresholds.lowCritical}
                    onChange={(e) => handleTemperatureThresholdChange('lowCritical', e.target.value)}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>-10°C</span>
                    <span>20°C</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="temp-low-warning" className="text-sm font-medium text-gray-700">
                      Seuil d'alerte bas
                    </label>
                    <span className="text-sm font-medium text-blue-600">{temperatureThresholds.lowWarning}°C</span>
                  </div>
                  <input
                    id="temp-low-warning"
                    type="range"
                    min="0"
                    max="25"
                    value={temperatureThresholds.lowWarning}
                    onChange={(e) => handleTemperatureThresholdChange('lowWarning', e.target.value)}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0°C</span>
                    <span>25°C</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="temp-high-warning" className="text-sm font-medium text-gray-700">
                      Seuil d'alerte haut
                    </label>
                    <span className="text-sm font-medium text-blue-600">{temperatureThresholds.highWarning}°C</span>
                  </div>
                  <input
                    id="temp-high-warning"
                    type="range"
                    min="30"
                    max="40"
                    value={temperatureThresholds.highWarning}
                    onChange={(e) => handleTemperatureThresholdChange('highWarning', e.target.value)}
                    className="w-full h-2 bg-yellow-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>30°C</span>
                    <span>40°C</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="temp-high-critical" className="text-sm font-medium text-gray-700">
                      Seuil critique haut
                    </label>
                    <span className="text-sm font-medium text-blue-600">{temperatureThresholds.highCritical}°C</span>
                  </div>
                  <input
                    id="temp-high-critical"
                    type="range"
                    min="35"
                    max="50"
                    value={temperatureThresholds.highCritical}
                    onChange={(e) => handleTemperatureThresholdChange('highCritical', e.target.value)}
                    className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>35°C</span>
                    <span>50°C</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mt-4 p-3 bg-gray-50 rounded-md">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs">Alerte critique: &lt; {temperatureThresholds.lowCritical}°C ou &gt; {temperatureThresholds.highCritical}°C</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs">Alerte: &lt; {temperatureThresholds.lowWarning}°C ou &gt; {temperatureThresholds.highWarning}°C</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Seuils d'humidité */}
            <div className="mb-8 border-t pt-6">
              <div className="flex items-center mb-4">
                <Droplets className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-medium">Humidité</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="humidity-low-critical" className="text-sm font-medium text-gray-700">
                      Seuil critique bas
                    </label>
                    <span className="text-sm font-medium text-blue-600">{humidityThresholds.lowCritical}%</span>
                  </div>
                  <input
                    id="humidity-low-critical"
                    type="range"
                    min="10"
                    max="40"
                    value={humidityThresholds.lowCritical}
                    onChange={(e) => handleHumidityThresholdChange('lowCritical', e.target.value)}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10%</span>
                    <span>40%</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="humidity-low-warning" className="text-sm font-medium text-gray-700">
                      Seuil d'alerte bas
                    </label>
                    <span className="text-sm font-medium text-blue-600">{humidityThresholds.lowWarning}%</span>
                  </div>
                  <input
                    id="humidity-low-warning"
                    type="range"
                    min="20"
                    max="50"
                    value={humidityThresholds.lowWarning}
                    onChange={(e) => handleHumidityThresholdChange('lowWarning', e.target.value)}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>20%</span>
                    <span>50%</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="humidity-high-warning" className="text-sm font-medium text-gray-700">
                      Seuil d'alerte haut
                    </label>
                    <span className="text-sm font-medium text-blue-600">{humidityThresholds.highWarning}%</span>
                  </div>
                  <input
                    id="humidity-high-warning"
                    type="range"
                    min="60"
                    max="80"
                    value={humidityThresholds.highWarning}
                    onChange={(e) => handleHumidityThresholdChange('highWarning', e.target.value)}
                    className="w-full h-2 bg-yellow-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>60%</span>
                    <span>80%</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="humidity-high-critical" className="text-sm font-medium text-gray-700">
                      Seuil critique haut
                    </label>
                    <span className="text-sm font-medium text-blue-600">{humidityThresholds.highCritical}%</span>
                  </div>
                  <input
                    id="humidity-high-critical"
                    type="range"
                    min="70"
                    max="95"
                    value={humidityThresholds.highCritical}
                    onChange={(e) => handleHumidityThresholdChange('highCritical', e.target.value)}
                    className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>70%</span>
                    <span>95%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mt-4 p-3 bg-gray-50 rounded-md">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs">Alerte critique: &lt; {humidityThresholds.lowCritical}% ou &gt; {humidityThresholds.highCritical}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs">Alerte: &lt; {humidityThresholds.lowWarning}% ou &gt; {humidityThresholds.highWarning}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Seuils de variation de poids */}
            <div className="border-t pt-6">
              <div className="flex items-center mb-4">
                <Scale className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-medium">Variation de poids</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="weight-low-warning" className="text-sm font-medium text-gray-700">
                      Alerte de baisse soudaine (%)
                    </label>
                    <span className="text-sm font-medium text-blue-600">{weightThresholds.lowWarningPercent}%</span>
                  </div>
                  <input
                    id="weight-low-warning"
                    type="range"
                    min="5"
                    max="30"
                    value={weightThresholds.lowWarningPercent}
                    onChange={(e) => handleWeightThresholdChange('lowWarningPercent', e.target.value)}
                    className="w-full h-2 bg-yellow-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5%</span>
                    <span>30%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Une alerte sera déclenchée si le poids baisse de plus de {weightThresholds.lowWarningPercent}% en 24h
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="weight-high-warning" className="text-sm font-medium text-gray-700">
                      Alerte d'augmentation soudaine (%)
                    </label>
                    <span className="text-sm font-medium text-blue-600">{weightThresholds.highWarningPercent}%</span>
                  </div>
                  <input
                    id="weight-high-warning"
                    type="range"
                    min="10"
                    max="50"
                    value={weightThresholds.highWarningPercent}
                    onChange={(e) => handleWeightThresholdChange('highWarningPercent', e.target.value)}
                    className="w-full h-2 bg-yellow-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10%</span>
                    <span>50%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Une alerte sera déclenchée si le poids augmente de plus de {weightThresholds.highWarningPercent}% en 24h
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Section des notifications */}
        {currentTab === 'notifications' && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Paramètres de notifications</h2>
            
            <div className="space-y-6">
              {/* Activation des notifications */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <label className="flex items-center space-x-2 text-gray-700">
                  <BellRing className="w-5 h-5 text-gray-500" />
                  <span>Activer les notifications</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              {/* Options de notification (email, SMS) */}
              {notificationsEnabled && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-gray-700">
                      <MailWarning className="w-5 h-5 text-gray-500" />
                      <span>Notifications par email</span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications(!emailNotifications)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-gray-700">
                      <Smartphone className="w-5 h-5 text-gray-500" />
                      <span>Notifications par SMS</span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={smsNotifications}
                        onChange={() => setSmsNotifications(!smsNotifications)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  {/* Niveaux d'alerte à notifier */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="text-md font-medium mb-3">Niveaux d'alerte à notifier</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="alert-high"
                          type="checkbox"
                          checked={true}
                          readOnly
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-not-allowed"
                        />
                        <label htmlFor="alert-high" className="ms-2 text-sm font-medium text-gray-700 flex items-center">
                          <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                          Alertes critiques (toujours activées)
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="alert-medium"
                          type="checkbox"
                          checked={true}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="alert-medium" className="ms-2 text-sm font-medium text-gray-700 flex items-center">
                          <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                          Alertes importantes
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="alert-low"
                          type="checkbox"
                          checked={false}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="alert-low" className="ms-2 text-sm font-medium text-gray-700 flex items-center">
                          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                          Alertes mineures
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Section des données et stockage */}
        {currentTab === 'data' && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Données et stockage</h2>
            
            <div className="space-y-6">
              {/* Durée de conservation des données */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Database className="w-5 h-5 text-gray-500" />
                  <label htmlFor="data-retention" className="text-gray-700">
                    Conservation des données historiques
                  </label>
                </div>
                <select
                  id="data-retention"
                  value={dataRetention}
                  onChange={(e) => setDataRetention(parseInt(e.target.value))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value={3}>3 mois</option>
                  <option value={6}>6 mois</option>
                  <option value={12}>12 mois</option>
                  <option value={24}>24 mois</option>
                  <option value={36}>36 mois</option>
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  Les données historiques détaillées seront conservées pendant {dataRetention} mois. 
                  Les données plus anciennes seront archivées et agrégées.
                </p>
              </div>
              
              {/* Exportation et sauvegarde des données */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-lg font-medium mb-3">Exportation et sauvegarde</h3>
                
                <div className="space-y-3">
                  <button className="w-full flex justify-center items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                    <Clock className="w-5 h-5" />
                    <span>Configurer les sauvegardes automatiques</span>
                  </button>
                  
                  <button className="w-full flex justify-center items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    <Database className="w-5 h-5" />
                    <span>Exporter toutes les données</span>
                  </button>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  Dernière sauvegarde complète: 12 juin 2023 à 08:45
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Bouton d'enregistrement des paramètres - full width sur mobile */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            disabled={updatingSettings}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-lg text-white ${
              updatingSettings ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {updatingSettings ? (
              <>
                <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Enregistrer les paramètres</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

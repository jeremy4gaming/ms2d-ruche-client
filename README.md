# 🐝 Application de Gestion d'Apiculture

Une application web moderne pour la gestion et le monitoring de ruches, permettant aux apiculteurs de suivre en temps réel l'état de leurs colonies.

## ✨ Fonctionnalités

### 📱 Page d'accueil
- Vue d'ensemble de toutes les ruches
- Statut en temps réel de chaque ruche
- Système de notifications pour les alertes
- Interface responsive et moderne
- Accès rapide aux détails de chaque ruche

### 📊 Page de détail d'une ruche
- Informations détaillées sur la ruche
- Graphiques interactifs (poids, température, humidité)
- Sélection de période (jour, semaine, mois, année)
- QR Code pour identification rapide
- Système d'alertes et d'interventions
- Gestion des actions correctives

## 🛠️ Technologies utilisées

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Recharts (graphiques)
  - Lucide React (icônes)
  - React Router DOM
  - QR Code Generator

## 📦 Installation

1. **Cloner le projet**
   ```bash
   git clone [url-du-projet]
   cd [nom-du-projet]
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Accéder à l'application**
   - Ouvrir votre navigateur
   - Accéder à `http://localhost:5173`

## 🚀 Déploiement

Pour créer une version de production :

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist`.

## 📝 Structure du projet

```
src/
├── api/          # Services API
├── components/   # Composants réutilisables
├── pages/        # Pages de l'application
├── types/        # Types TypeScript
└── data/         # Données mockées
```

### Composants principaux

- `HiveCard` : Carte affichant les informations d'une ruche
- `AlertBadge` : Badge pour les notifications
- `InterventionModal` : Modal pour les actions correctives
- `NotificationsModal` : Liste complète des notifications

## 🔄 API

L'application expose plusieurs endpoints pour la gestion des données :

- `/api/hives` : Gestion des ruches
- `/api/alerts` : Système d'alertes
- `/api/interventions` : Enregistrement des interventions

## 🎨 Personnalisation

### Thème

Le thème peut être personnalisé via Tailwind CSS dans le fichier `tailwind.config.js`.

### Alertes

Les types d'alertes et leurs actions associées peuvent être configurés dans `src/data.ts`.

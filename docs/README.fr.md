[中文](../README.md) | [English](README.en.md) | **Français** | [Español](README.es.md) | [Русский](README.ru.md) | [العربية](README.ar.md) | [日本語](README.ja.md)

# Time Tracker ⏱

> Le temps est votre ressource la plus essentielle — là où vous le consacrez détermine qui vous devenez.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-brightgreen)](https://xixihaha1135-star.github.io/time-tracker/)

Un Skill de suivi du temps multiplateforme. Dites à votre Agent en langage naturel ce que vous avez fait et combien de temps vous y avez consacré — il enregistre automatiquement, fusionne les alias, classe par catégorie et génère des rapports visuels.

**Live Demo**: https://xixihaha1135-star.github.io/time-tracker/

---

## Fonctionnalités

- **Saisie en langage naturel, sans friction** — Dites simplement « 30 minutes de lecture » et c'est enregistré. Pas d'application à ouvrir, pas de formulaire à remplir.
- **Fusion intelligente d'alias + classification automatique** — « jouer au ballon » est automatiquement fusionné avec « basketball » ; chaque activité est classée dans l'une des cinq catégories : Étude, Vie quotidienne, Exercice, Divertissement, Travail.
- **Calendrier à trois niveaux + tableau de bord visuel** — Vue annuelle en heatmap, statistiques hebdomadaires en vue mensuelle, détails en vue journalière. Explorez par niveau pour voir exactement où passe votre temps.
- **Deux thèmes en un clic** — Thème sombre style GitHub (reposant pour les yeux) / thème clair style Apple Health (épuré), adapté à tous les contextes.
- **Vos données vous appartiennent** — Tous les enregistrements sont stockés dans un seul fichier `records.json`. Changez d'ordinateur, de plateforme ou d'Agent : copiez-collez et c'est tout.
- **Multiplateforme** — Un seul SKILL.md compatible avec Claude Code / Cursor / Coze / Lark / tout Agent IA générique.
- **Détails de niveau journal** — Extrait automatiquement les détails spécifiques (titre de livre, nom de jeu, etc.) lors de l'enregistrement, pour vous souvenir exactement de ce que vous faisiez.

---

## Démarrage rapide

### Méthode 1 : Claude Code (recommandé)

```bash
# 1. Cloner le dépôt
git clone https://github.com/xixihaha1135-star/time-tracker.git

# 2. Copier SKILL.md dans votre projet
mkdir -p votre-projet/.claude/skills/time-tracker
cp time-tracker/SKILL.md votre-projet/.claude/skills/time-tracker/

# 3. Copier la page de visualisation
cp time-tracker/index.html votre-projet/.claude/skills/time-tracker/

# records.json sera créé automatiquement lors de la première utilisation
```

Une fois installé, dites simplement à Claude Code :

- « 30 minutes de lecture » → enregistrement automatique
- « statistiques » → rapport textuel
- « ouvrir les stats » → ouvre la page de visualisation

### Méthode 2 : Cursor / Copilot / IDE IA générique

1. Ouvrez `SKILL.md` et copiez tout son contenu
2. Collez-le dans votre `.cursorrules`, `copilot-instructions.md` ou le fichier d'instructions agent de votre projet
3. Placez `index.html` à un emplacement accessible. Dites « enregistrer du temps » à l'Agent — il crée automatiquement `records.json` (voir `records.example.json` pour le format)

### Méthode 3 : Coze / Lark / Agent générique

1. Ouvrez `SKILL.md` et copiez tout son contenu
2. Collez-le dans le **System Prompt** de votre agent
3. Téléversez `records.example.json` comme fichier de base de connaissances (pour le format). L'Agent crée automatiquement votre `records.json` à la première utilisation
4. Commencez à enregistrer via la conversation

---

## Exemples d'utilisation

### Enregistrer du temps

```
Vous : 30 minutes de lecture
Agent : Enregistré : Lecture 30 min (Étude) ✅  Aujourd'hui : 1 entrée, 30 min au total.
```

### Enregistrement par lot

```
Vous : 30min lecture, 20min jeux vidéo, 30min repas
Agent : 3 entrées enregistrées, 80 min au total ✅
      - Lecture 30 min (Étude)
      - Jeux vidéo 20 min (Divertissement)
      - Repas 30 min (Vie quotidienne)
      Aujourd'hui : 3 entrées, 80 min au total.
```

### Enregistrer avec des détails

```
Vous : lecture de « Le temps est un ami » pendant 30 minutes
Agent : Enregistré : Lecture (Le temps est un ami) 30 min (Étude) ✅  Aujourd'hui : 1 entrée, 30 min au total.
```

### Consulter les statistiques

```
Vous : aujourd'hui
Agent : 📊 Rapport du jour (14/06)
      Total : 4 entrées | Durée totale : 3 h 30 min
      📂 Par catégorie :
      1. Étude — 2 h (57 %)
      2. Vie quotidienne — 1 h (29 %)
      3. Exercice — 30 min (14 %)

Vous : cette semaine
Agent : 📊 Rapport de la semaine (9/06 – 14/06)
      Total : 31 entrées | Durée totale : 18 h 45 min
      📂 Par catégorie :
      1. Étude — 8 h 30 (45 %)
      2. Travail — 5 h (27 %)
      3. Vie quotidienne — 3 h (16 %)
      4. Exercice — 1 h 45 (9 %)
      5. Divertissement — 30 min (3 %)
      📋 Classement des activités :
      1. Préparation CET-6 — 6 h
      2. Recherche IA — 2 h 30
      3. Blog — 2 h
      ...
```

### Fusion d'alias

```
Vous : fusionner "jouer au ballon" avec "basketball"
Agent : « jouer au ballon » fusionné avec « basketball ». 3 entrées historiques mises à jour.
```

### Modifier une entrée

```
Vous : je me suis trompé, c'était en fait 1 heure
Agent : Modifié : Recherche IA 60 min ✅ (était 30 min)
```

### Supprimer une entrée

```
Vous : supprimer la dernière entrée
Agent : Confirmer la suppression de « Préparation CET-6 60 min » (Étude) ?
Vous : oui
Agent : Supprimé ✅
```

---

## Visualisation

La démo en ligne présente trois vues, les données proviennent de `records.json`, chargé directement depuis le même répertoire :

| Vue | Description |
|------|------|
| **Heatmap annuelle** | Grille calendaire de 365 jours — plus la couleur est foncée, plus le temps investi est important. Cliquez sur un jour pour voir toutes ses entrées. |
| **Courbe de tendance** | Comparez l'évolution du temps passé par activité/catégorie. Basculez entre 30, 90 ou 365 jours, avec zoom et défilement. |
| **Rapport d'analyse** | Classement des activités, répartition par catégorie, variation d'un mois sur l'autre, moyenne quotidienne, plus gros poste de dépense — résumé textuel en un clic. |

**Deux thèmes** disponibles : basculez en un clic (coin supérieur droit) entre le thème sombre (style GitHub, par défaut) et le thème clair (style Apple Health).

> Page de visualisation complète : https://xixihaha1135-star.github.io/time-tracker/

---

## Format des données

Tous les enregistrements sont stockés dans `records.json`. Structure v2 :

```json
{
  "version": "2.0",
  "aliases": {
    "lire en anglais": "lecture",
    "coder avec IA": "recherche IA"
  },
  "records": [
    {
      "id": "20260610-182449-fc55",
      "date": "2026-06-10",
      "start": "",
      "end": "",
      "duration_min": 30,
      "activity": "lecture",
      "raw_input": "30 minutes de lecture",
      "created_at": "2026-06-10T18:24:49.079383Z",
      "category": "Étude"
    }
  ],
  "categories": {
    "Étude": ["lecture", "devoirs", "préparation CET-6"],
    "Vie quotidienne": ["repas", "lessive", "repos"],
    "Exercice": ["entraînement matinal", "fitness"],
    "Divertissement": ["téléphone", "jeux vidéo"],
    "Travail": ["recherche IA", "blog", "réunion", "travail"]
  }
}
```

**Description des champs :**

| Champ | Type | Description |
|------|------|------|
| `version` | string | Version du format de données, actuellement `"2.0"` |
| `aliases` | object | Table de correspondance des alias — clé = nom saisi par l'utilisateur, valeur = nom standard de l'activité |
| `records[].id` | string | Identifiant unique, format `YYYYMMDD-HHmmss-xxxx` |
| `records[].date` | string | Date de l'enregistrement, format `YYYY-MM-DD` |
| `records[].start` | string | Heure de début (optionnel), format `HH:mm` |
| `records[].end` | string | Heure de fin (optionnel), format `HH:mm` |
| `records[].duration_min` | number | Durée en minutes |
| `records[].activity` | string | Nom standard de l'activité (après résolution des alias) |
| `records[].raw_input` | string | Saisie brute de l'utilisateur, conservée pour traçabilité |
| `records[].created_at` | string | Horodatage de création, format ISO 8601 |
| `records[].category` | string | Catégorie (Étude / Vie quotidienne / Exercice / Divertissement / Travail / Autre) |
| `categories` | object | Dictionnaire des catégories — clé = nom de la catégorie, valeur = liste des activités associées |

**Attribution automatique des catégories** : lors de l'enregistrement d'une nouvelle activité, l'Agent parcourt le dictionnaire `categories` pour trouver une correspondance. Les activités non reconnues sont placées dans « Autre » et l'Agent demande à l'utilisateur quelle catégorie lui attribuer.

**Migration de v1 à v2** : par rapport à v1, la v2 ajoute un champ `category` à chaque entrée et un dictionnaire `categories` au niveau racine. Pour migrer depuis v1, ajoutez simplement ces deux champs manuellement — aucun script nécessaire.

---

## Migration des données

**Principe de conception** : vos données vous suivent, sans être liées à aucune plateforme.

### Export

Copiez `records.json`. Un seul fichier contient l'intégralité de vos enregistrements, alias et configuration des catégories.

```bash
# Sauvegarde vers l'emplacement de votre choix
cp records.json ~/backup/records-$(date +%Y%m%d).json
```

### Import

Placez `records.json` à la racine du projet dans le nouvel environnement (ou à un chemin détectable par SKILL.md) — l'Agent le reconnaît automatiquement et reprend l'enregistrement.

### Multiplateforme

Un même fichier `records.json` est entièrement compatible avec Claude Code, Cursor, Coze, Lark et toutes les autres plateformes — aucun format supplémentaire, aucune conversion nécessaire.

### Migration multiplateforme

```
Vous : exporter mes données
Agent : 📦 Exportation des données terminée
      [contenu JSON complet]
      Utilisation : copiez le JSON, dites « importer les données » sur la nouvelle plateforme et collez-le
```

---

## Contribuer

Les PR sont les bienvenues. Pour signaler un problème, rendez-vous sur [GitHub Issues](https://github.com/xixihaha1135-star/time-tracker/issues).

---

## Licence

MIT — libre d'utilisation, de modification et de redistribution.

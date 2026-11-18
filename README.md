# 🧙 Poudlard EDT

Application web de gestion des emplois du temps des élèves et du personnel de Poudlard.

## Présentation du projet

**Poudlard EDT** est une application permettant de gérer les emplois du temps des élèves et des membres du personnel de l'école de sorcellerie Poudlard.

Dumbledore et toute son équipe ayant déjà beaucoup de responsabilités, ont décidé de faire appel à nous pour développer une application permettant de centraliser la gestion de l'établissement.

L'application permet de recenser les sorciers, les matières, les classes, les maisons et les rôles afin de faciliter l'organisation de la vie scolaire.

## Fonctionnalités

L'application propose plusieurs fonctionnalités :

- **Gestion des sorciers** : création, consultation et gestion des profils.
- **Gestion des matières** : ajout et gestion des différentes matières enseignées.
- **Gestion des classes** : organisation des élèves en six niveaux.
- **Gestion des maisons** : répartition des apprentis entre Gryffondor, Serpentard, Serdaigle et Poufsouffle.
- **Gestion des rôles** : attribution de plusieurs rôles à un même sorcier.
- **Consultation des emplois du temps** : accès aux emplois du temps des élèves et des professeurs.
- **Authentification** : accès aux fonctionnalités protégées selon le profil de l'utilisateur.

## Cahier des charges et contraintes

Le projet respecte les règles suivantes :

- Chaque matière possède sa propre salle dédiée.
- Un sorcier peut posséder plusieurs rôles.
- Il existe six niveaux de classe.
- Un sorcier ne peut appartenir qu'à un seul niveau de classe.
- Tous les élèves d'une même classe possèdent le même emploi du temps.
- Chaque apprenti sorcier appartient à une seule maison.
- Les membres du staff n'appartiennent à aucune maison.
- Les quatre maisons sont Gryffondor, Serpentard, Serdaigle et Poufsouffle.

### Gestion des accès

- La liste des membres du staff et des matières est accessible publiquement.
- Les autres informations et fonctionnalités sont protégées par un système d'authentification.

## Technologies utilisées

- **React** : bibliothèque JavaScript pour construire l'interface utilisateur.
- **Vite** : outil de développement et de compilation.
- **JavaScript** : langage de programmation.
- **Tailwind CSS** : framework CSS pour la mise en forme.
- **React Router** : gestion de la navigation entre les pages.
- **LocalStorage** : stockage local des informations de session utilisateur.

## Installation

### 1. Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/).
- [npm](https://www.npmjs.com/).
- [Git](https://git-scm.com/).

### 2. Récupérer le projet

Cloner le dépôt GitHub :

```bash
git clone https://github.com/BielsaG/poudlard-edt.git
```

Accéder au dossier du projet :

```bash
cd poudlard-edt
```

### 3. Installer les dépendances

À la racine du projet, exécuter :

```bash
npm install
```

## Lancement du projet

Pour lancer le serveur de développement :

```bash
npm run dev
```

Une fois le serveur démarré, Vite affiche une adresse locale dans le terminal.

Par défaut, l'application est généralement accessible à l'adresse :

```text
http://localhost:5173
```

Ouvrir cette adresse dans un navigateur pour accéder à Poudlard EDT.

Pour arrêter le serveur, utiliser :

```bash
Ctrl + C
```

## Build du projet

Pour générer une version optimisée de l'application destinée à la production :

```bash
npm run build
```

# 🚆 Horaires Train et Bus – Installation & Lancement

Ce document explique comment installer le projet, configurer le fichier `.env` et lancer l’application.

---

## 📦 Prérequis

- **Node.js** version **18.x.x ou supérieure**  
  👉 Téléchargement : https://nodejs.org/en/download

- **Git** installé sur votre machine

---

## 📥 Cloner le dépôt

Commencez par cloner le repository GitHub :

```bash
git clone https://github.com/rbastide/Horaires-Train-et-Bus.git
```
Puis placez-vous dans le dossier du projet :

```bash
cd Horaires-Train-et-Bus
```

## 📦 Installation des dépendances

Depuis le dossier **BackEnd** :
```bash
cd src/BackEnd/
```

, exécutez la commande suivante dans un terminal :
```bash
npm install cors dotenv express
```
Si une confirmation est requise, tapez **y** puis appuyez sur **Entrée**

---

## 🔐 Configuration du fichier .env
### 1️⃣ Créer le fichier .env

- Le fichier .env doit être créé au **même emplacement** que le fichier .env-example
- Inspirez-vous directement de **.env-example** pour sa structure

### 2️⃣ Renseigner les variables d’environnement

Dans le fichier **.env**, vous devrez :

- 🔑 **Demander un token API SNCF**
  👉 https://numerique.sncf.com/startup/api/
- 🌐 **Renseigner l’URL de l’API SNCF** que vous souhaitez utiliser
- 📍 **Définir le paramètre coverage** souhaité
- 🚪 **Choisir le port** sur lequel le backend devra tourner

👉 Exemple de fichier .env (à adapter selon vos besoins) :

<img width="459" height="128" alt="image" src="https://github.com/user-attachments/assets/047257be-46b5-468b-8ca8-ef48d2391ca7" />

---

## ▶️ Lancer l’application

Une fois toutes les étapes précédentes terminées :
✅ **Double-cliquez sur le fichier** :

```bash
Lancement.bat
```
Le backend, frontend ainsi que la page s'ouvre automatiquement sur les port que vous avez défini dans le **.env**

--- 

## ✅ Application prête
L’application est maintenant lancée et prête à être utilisée 🚀

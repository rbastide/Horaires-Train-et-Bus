// Import des fonctionnalités
import { Router } from "express";

// Port du backend
const PORT = process.env.PORT;

// Adresse du backend
const API_BASE = process.env.API_BASE;

// Stop area du périgueux

const STOP_AREA_PERIGUEUX = process.env.STOP_AREA_PERIGUEUX

// Création du routeur
const router = Router();

// Envoie de l'adresse du backend complète
router.get("/config", (_req, res) => {
  const apiBase = `${API_BASE}:${PORT}/api`;

  res.type("application/javascript").send(
    `window.APP_CONFIG = ${JSON.stringify({ API_BASE: apiBase , STOP_AREA : STOP_AREA_PERIGUEUX})};`
  );
});

export default router;

import { Router } from "express";
import { getDestinationCodeAndLabel } from "../../queries/getDestinationCodeAndLabel.js";
import { getWaitingTime, toHHMM, toMMSS,toHHMMit, timeToSeconds } from "../../utils/helpers.js";
import { getEstimatedAndScheduledTime } from "../../queries/getEstimatedAndScheduledTime.js";
import { getLineIdAndLineCode } from "../../queries/getLineIdAndLineCode.js";
import { getStopIdStopCodeStopLabelOfEveryTrainStation } from "../../queries/getStopIdStopCodeStopLabel.js";

// Création du router
const router = Router();

// Route pour l'appel de l'API des Bus : "/busBoard"
router.get("/busBoard", async(req , res) => {
    try{
        // Arrêts de bus
        const stopsBus = ['Gare SNCF', 'PEM'];

        // Variable contenant les données des bus
        const stops = await getStopIdStopCodeStopLabelOfEveryTrainStation(stopsBus);
        const lineCode = await getLineIdAndLineCode(stopsBus);
        const destination = await getDestinationCodeAndLabel(stopsBus);
        // Heure actuel sous le format HH:MM:SS
        const localTime = new Date().toLocaleTimeString("it-IT");
        const estimatedTime = await getEstimatedAndScheduledTime(localTime,stopsBus);

        // Tableau vide ayant pour but de contenir toutes les lignes du tableau
        const rows = [];

        // On balaye chaque ligne par l'heure de passage
        // Question d'un affichage plus cohérent
        estimatedTime?.forEach(esTime => {

            // On cherche pour chaque valeur l'identifiant de l'arret équivalent 
            const line = lineCode?.find(l => l.link_stop_start_id === esTime.stop_id);
            const dest = destination?.find(d => d.link_stop_start_id === esTime.stop_id);
            const stop = stops?.find(s => s.stop_id === esTime.stop_id);

            // Si les valeurs suivantes exitstes alors 
            // On récupère le temps estimé s'il existe, sinon on prend le temps prévu
            // Ensuite on calcule le temps d'attente en secondes 
            if (stop && dest && line) {
                const realTime = esTime.passing_time_estimated || esTime.passing_time_scheduled;
                const waitedTime = timeToSeconds(getWaitingTime(timeToSeconds(localTime), timeToSeconds(realTime)));
                
                // On ajoute par ligne dans le tableau rows nos données importantes
                rows.push({
                    line: line.line_code,
                    stops: stop.stop_label,
                    destinations: dest?.route_destination_label || "--",
                    passing_time: toHHMMit(realTime),
                    timeToWait: waitedTime,
                });
            }
        });

        // On renvoie le nombre de lignes du tableau ainsi que le tableau en lui-même
        return res.json({
            total : rows.length,
            rows,
        });
    }
    // Si une erreur survient on la soulève ici
    catch (e) {
        console.error("Une erreur est survenue !");
        return res.status(500).json({error: String(e)});
        }
    
    });

export default router;
import { Router } from "express";
import { getAllResources } from "../../queries/getAllResources.js";
import { getStop } from "../../queries/getStop.js";
import { getDestinationByStop } from "../../queries/getDestinationByStop.js";
import { getEstimatedTimeByStop } from "../../queries/getEstimatedTimeByStop.js";
import { getLineByStop } from "../../queries/getLineByStop.js";
import { getWaitingTime, toHHMM } from "../../utils/helpers.js";
import dotenv from "dotenv";

const router = Router();

router.get("/boardBus", async(req , res) => {
    try{
        const stop = getStop();
        const lineCode = getLineByStop(stop)
        const destination = getDestinationByStop(stop);
        const estimatedTime = getEstimatedTimeByStop(stop);
        const startedTime = new Date().toLocaleTimeString();
        const waitedTime = getWaitingTime(startedTime, estimatedTime);
        const rows = [];
        rows.push({
            line: lineCode,
            stops: stop,
            destinations: destination,
            time: toHHMM(estimatedTime),
            timeToWait: waitedTime,
        });

        return res.json({
            total : rows.length,
            rows,
        });
    }
    catch (e) {
        return res.status(500).json({error: String(e)});
        }
    
    });

export default router;
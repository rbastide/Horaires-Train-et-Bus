import { Router } from "express";
import { getAllResources } from "../../Queries/getAllResources";
import { getStop } from "../../Queries/getStop";
import { getDestinationByStop } from "../../Queries/getDestinationByStop";
import { getEstimatedTimeByStop } from "../../Queries/getEstimatedTimeByStop";
import { getLineByStop } from "../../queries/getLineByStop";
import { getWaitingTime } from "../../utils/helpers";
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
            time: estimatedTime,
            timeToWaite: waitedTime,
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
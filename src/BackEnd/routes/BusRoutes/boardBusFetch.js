import { Router } from "express";
import { getDestinationCodeAndLabel } from "../../queries/getDestinationCodeAndLabel.js";
import { getWaitingTime, toHHMM, toMMSS,toHHMMit, timeInSecondesToTimeInMinutes, timeToSeconds } from "../../utils/helpers.js";
import { getEstimatedAndScheduledTime } from "../../queries/getEstimatedAndScheduledTime.js";
import { getLineIdAndLineCode } from "../../queries/getLineIdAndLineCode.js";
import { getStopIdStopCodeStopLabelOfEveryTrainStation } from "../../queries/getStopIdStopCodeStopLabel.js";

const router = Router();

router.get("/busBoard", async(req , res) => {
    try{
        const stops = await getStopIdStopCodeStopLabelOfEveryTrainStation();

        const lineCode = await getLineIdAndLineCode();

        const destination = await getDestinationCodeAndLabel();
        const localTime = new Date().toLocaleTimeString("it-IT");
        const estimatedTime = await getEstimatedAndScheduledTime(localTime);

        const rows = [];

        // Iterate through line codes (which should be the detailed data)
        estimatedTime?.forEach(esTime => {

            // Find corresponding stop label for this stop
            const line = lineCode?.find(l => l.link_stop_start_id === esTime.stop_id);
            // Find corresponding destination for this stop
            const dest = destination?.find(d => d.link_stop_start_id === esTime.stop_id);
            // Find corresponding time data for this stop
            const stop = stops?.find(s => s.stop_id === esTime.stop_id);
            if (stop && dest && line) {
                const realTime = esTime.passing_time_estimated || esTime.passing_time_scheduled;
                const waitedTime = timeInSecondesToTimeInMinutes(timeToSeconds(getWaitingTime(timeToSeconds(localTime), timeToSeconds(realTime))));
                
                rows.push({
                    line: line.line_code,
                    stops: stop.stop_label,
                    destinations: dest?.route_destination_label || "--",
                    passing_time: toHHMMit(realTime),
                    timeToWait: waitedTime,
                });
            }
        });

        console.log(rows);

        return res.json({
            total : rows.length,
            rows,
        });
    }
    catch (e) {
        console.error("Une erreur est survenue !");
        return res.status(500).json({error: String(e)});
        }
    
    });

export default router;
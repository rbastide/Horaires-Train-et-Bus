import { Router } from "express";
import { getDestinationCodeAndLabel } from "../../queries/getDestinationCodeAndLabel.js";
import { getWaitingTime, toHHMM, toMMSS,toHHMMit } from "../../utils/helpers.js";
import { getEstimatedAndScheduledTime } from "../../queries/getEstimatedAndScheduledTime.js";
import { getLineIdAndLineCode } from "../../queries/getLineIdLineAndLineCode.js";
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
        stops?.forEach(stop => {
            
            // Find corresponding destination for this stop
            const dest = destination?.find(d => d.link_stop_start_id === stop.stop_id);
            // Find corresponding time data for this stop
            const time = estimatedTime?.find(t => t.stop_id === stop.stop_id);            

            // Find corresponding stop label for this stop
            const line = lineCode?.find(l => l.link_stop_start_id === stop.stop_id);
            

            if (time && dest && line) {
                const realTime = time.passing_time_estimated || time.passing_time_scheduled;
                const waitedTime = toMMSS(getWaitingTime(localTime, realTime));
                

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
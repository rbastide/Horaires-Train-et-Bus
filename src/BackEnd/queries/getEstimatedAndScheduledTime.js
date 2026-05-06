import { query } from "../services/databaseConnection.js";
import { getListStops } from "../Utils/helpers.js";

export async function getEstimatedAndScheduledTime(localTime,stops){
    const rows = await query(`SELECT DISTINCT pt.passing_time_scheduled, pt.passing_time_estimated, pt.stop_id FROM v_avl_rt_passing_times pt WHERE pt.stop_label IN (${getListStops(stops)}) AND pt.passing_time_scheduled >= "${localTime}" ORDER BY pt.passing_time_scheduled, pt.passing_time_estimated ASC;`);
    return rows || null;
}
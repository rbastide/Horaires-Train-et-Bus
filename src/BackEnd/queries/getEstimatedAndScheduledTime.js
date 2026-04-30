import { query } from "../services/databaseConnection.js";

export async function getEstimatedAndScheduledTime(localTime){
    const rows = await query(`SELECT pt.passing_time_scheduled, pt.passing_time_estimated, pt.stop_id FROM v_avl_rt_passing_times pt JOIN (SELECT s.stop_id, s.stop_code, s.stop_label FROM v_avl_rt_stops s WHERE s.stop_label = "Gare SNCF" OR s.stop_label = "PEM") stops ON pt.stop_id = stops.stop_id WHERE pt.passing_time_scheduled >= "${localTime}" OR pt.passing_time_estimated >= "${localTime}" ORDER BY pt.passing_time_scheduled, pt.passing_time_estimated ASC;`);
    return rows || null;
}
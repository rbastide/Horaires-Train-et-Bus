import { query } from "../services/databaseConnection.js";

export async function getStopIdStopCodeStopLabelOfEveryTrainStation(){
    const rows = await query('SELECT s.stop_id, s.stop_code, s.stop_label FROM v_avl_rt_stops s WHERE s.stop_label = "Gare SNCF" OR s.stop_label = "PEM";')
    return rows || null;
}

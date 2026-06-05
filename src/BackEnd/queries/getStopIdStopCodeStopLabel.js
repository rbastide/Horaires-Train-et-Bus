import { query } from "../services/databaseConnection.js";
import { getListStops } from "../Utils/helpers.js";

export async function getStopIdStopCodeStopLabelOfEveryTrainStation(stops){
    const rows = await query(`SELECT pt.stop_id, pt.stop_code, pt.stop_label FROM v_avl_rt_passing_times pt WHERE pt.stop_label IN (${getListStops(stops)}) GROUP BY pt.stop_id, pt.stop_code, pt.stop_label;`);
    return rows || null;
}

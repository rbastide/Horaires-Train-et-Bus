import { query } from "../services/databaseConnection.js";
import { getListStops } from "../Utils/helpers.js";

export async function getLineIdAndLineCode(stops){
    const rows = await query(`SELECT routes.line_id, routes.line_code, routes.link_stop_start_id FROM v_avl_rt_routes routes WHERE routes.link_stop_start_id IN (SELECT pt.stop_id FROM v_avl_rt_passing_times pt WHERE pt.stop_label IN (${getListStops(stops)}) GROUP BY pt.stop_id);`);
    return rows || null;
}
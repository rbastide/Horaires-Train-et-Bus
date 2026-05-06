import { query } from "../services/databaseConnection.js";
import { getListStops } from "../Utils/helpers.js"

export async function getDestinationCodeAndLabel(stops){
    const rows = await query(`SELECT routes.route_destination_code, routes.route_destination_label, routes.link_stop_start_id FROM v_avl_rt_routes routes WHERE routes.link_stop_start_id IN (SELECT pt.stop_id FROM v_avl_rt_passing_times pt WHERE pt.stop_label IN (${getListStops(stops)}) ORDER BY pt.passing_time_scheduled, pt.passing_time_estimated ASC) AND routes.route_destination_label IS NOT NULL;`);
    return rows || null;
}
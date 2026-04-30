import { query } from "../services/databaseConnection.js";

export async function getLineIdAndLineCode(){
    const rows = await query(`SELECT routes.line_id, routes.line_code, routes.link_stop_start_id FROM v_avl_rt_routes routes JOIN (SELECT s.stop_id, s.stop_code, s.stop_label FROM v_avl_rt_stops s WHERE s.stop_label = "Gare SNCF" OR s.stop_label = "PEM") stops ON routes.link_stop_start_id = stops.stop_id`);
    return rows || null;
}
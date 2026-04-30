import { query } from "../services/databaseConnection.js";

export async function getDestinationCodeAndLabel(){
    const rows = await query('SELECT routes.route_destination_code, routes.route_destination_label, routes.link_stop_start_id FROM v_avl_rt_routes routes WHERE routes.link_stop_start_id IN (SELECT s.stop_id FROM v_avl_rt_stops s WHERE s.stop_label = "Gare SNCF" OR s.stop_label = "PEM") AND routes.route_destination_label IS NOT NULL;');
    return rows || null;
}
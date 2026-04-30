import { query } from "../services/databaseConnection.js";

export async function getLineIdAndLineCode(){
    const rows = await query(`SELECT routes.line_id, routes.line_code, routes.link_stop_start_id FROM v_avl_rt_routes routes WHERE routes.link_stop_start_id IN (SELECT pt.stop_id FROM v_avl_rt_passing_times pt WHERE pt.stop_label IN ("Gare SNCF","PEM") GROUP BY pt.stop_id);`);
    return rows || null;
}
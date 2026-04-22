import { query } from "../services/databaseConnection.js";

export async function getLineByStop(stop){
    const rows = await query("SELECT line_code FROM v_avl_rt_lines");
    return rows || null;
}
import { query } from "../services/databaseConnection.js";

export async function getEstimatedTimeByStop(stop){
    const rows = await query("");
    return rows || null;
}
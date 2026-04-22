import { query } from "../services/databaseConnection.js";

export async function getStop(stop){
    const rows = await query("");
    return rows || null;
}
import { query } from "../services/databaseConnection.js";

export async function getDestinationByStop(stop){
    const rows = await query("");
    return rows || null;
}
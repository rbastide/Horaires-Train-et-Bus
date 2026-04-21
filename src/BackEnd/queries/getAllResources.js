import { query } from "../services/databaseConnection.js";

export async function getAllResources(){
    const rows = await query("SELECT * FROM Courses");
    return rows || null;
}
import { query } from "../services/databaseConnection";

export async function getAllResources(){
    const rows = await query("SELECT * FROM Courses");
    return rows || null;
}
import mysql from "mysql";

// Création d'un pool de connexions MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: 10,
});

// Fonction pour exécuter une requête SQL
export function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
}

// Test si la connextion à la base de données est possible
export function testDatabaseConnection() {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
        return;
      }

      console.log("Connexion réussi avec succès ! ");
      connection.release();
      resolve();
    });
  });
}

export default pool;

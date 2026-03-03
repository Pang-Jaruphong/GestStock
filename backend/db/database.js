import mysql from 'mysql2/promise'
import 'dotenv/config'

const db = {
    connectToDatabase: async () =>{
        const con = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });
        return con;
    },
    disconnectFromDatabase: async (con) => {
        try {
            await con.end();
        } catch (error) {
            console.error('Erreur lors de la déconnexion :', error);
        }
    },
}

export {db}
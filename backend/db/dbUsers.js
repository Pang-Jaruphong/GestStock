import {db} from './database.js'

const dbUsers = {
    getAllUsers : async () => {
        let con;
        try {
            con = await db.connectToDatabase();
            const sql = `
                SELECT 
                    mail, 
                    CASE 
                        WHEN admin = 1 THEN 'Admin' ELSE 'Utilisateur'
                        END AS 'Rôle'
                FROM users`;
            const [rows] = await con.query(sql);
            return rows;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    }
}

export {dbUsers};
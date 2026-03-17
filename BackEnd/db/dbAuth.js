import { db } from './database.js';
import bcrypt from 'bcrypt'; // hash password

// Help by Gemini
const dbAuth = {
    // Search by Token
    findUserByToken: async (token) => {
        let con;
        try{
            con = await db.connectToDatabase();
            const sql = `
                SELECT id, mail FROM users 
                WHERE resetToken = ?`;
            const [rows] = await con.execute(sql, [token]);
            return rows[0];
        } catch (error) {
            console.error("Erreur recherche token :", error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    activatePassword : async (id, plainPassword) => {
        let con;
        try {
            con = await db.connectToDatabase();

            // hash password
            const hashedPassword = await bcrypt.hash(plainPassword, 12);

            const sql = `
                UPDATE users SET password = ?, resetToken = NULL
                WHERE id = ?;`
            const [result] = await con.execute(sql, [id, hashedPassword]);
            return result;
        } catch (error) {
            console.error("Erreur activation mot de passe :", error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

};

export {dbAuth};
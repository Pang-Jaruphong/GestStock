import { db } from './database.js';
import bcrypt from 'bcrypt'; // hash password
import crypto from 'crypto'; // generate tokens

// Help by Gemini
const dbAuth = {
    // Search by Token
    findUserByToken: async (token) => {
        let con;
        try {
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

    findUserByMail: async (mail) => {
        let con;
        try {
            con = await db.connectToDatabase();
            const sql = `
                SELECT id, mail, password FROM users
                WHERE mail = ?`;
            const [rows] = await con.execute(sql, [mail]);
            return rows[0];
        } catch (error) {
            console.error("Erreur recherche mail :", error);
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
            const [result] = await con.execute(sql, [hashedPassword, id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Erreur activation mot de passe :", error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    // Generate et save a token by mail in BDD
    generateResetToken: async (mail) => {
        let con;
        try {
            con = await db.connectToDatabase();
            // random token
            const token = crypto.randomBytes(32).toString('hex');

            // save BDD
            const sql = `UPDATE users SET resetToken = ? WHERE mail = ?`;
            const [result] = await con.execute(sql, [token, mail]);

            return result.affectedRows > 0 ? token : null;
        } catch (error) {
            console.error("Erreur génération token :", error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    }
};

export {dbAuth};
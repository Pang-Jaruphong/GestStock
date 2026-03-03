import {db} from './database.js'

const dbOrdersHasArticles = {
    getAllOrdersHasArticles : async () =>{
        let con;
        try {
            con = await db.connectToDatabase();
            const sql = `SELECT * FROM orders_has_articles`
            const [rows] = await con.query(sql);
            return rows;
        } catch (error) {
            console.log("Erreur SQL lors de la récupération :",error.message);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    }
}
export {dbOrdersHasArticles};
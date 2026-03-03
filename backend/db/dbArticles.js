import {db} from './database.js'

const dbArticles = {
    getAllArticles : async () =>{
        let con;
        try {
            con = await db.connectToDatabase();
            // Join suppliers in article
            const sql =
                `SELECT a.refArticle,
                    a.name AS "Nom de l'article", 
                    a.description,
                    a.buyPrice AS "Prix d'achat",
                    a.salePrice AS "Prix de vente",
                    a.actualStock AS "Stock actuel",
                    a.minStock AS "Stock minimun",
                    s.refSupplier,
                    s.name AS "Nom de fournisseur"
            FROM articles a
            JOIN suppliers s ON a.supplier_id = s.id`

            const [rows] = await con.query(sql);
            return rows;
        } catch (error) {
            console.log("Erreur SQL lors de la récupération :",error.message);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },
    createArticles : async (articles) =>{
        let con;
        try {
            con = await db.connectToDatabase();
            const sql =
                `INSERT INTO articles a
                (refArticle, name, Description, buyPrice, salePrice, minStock, supplier_id)
                VALUES (?,?,?,?,?,?,?)`;

            const values = [
                a.refArticle,
                a.name,
                a.description,
                a.buyPrice,
                a.salePrice,
                a.minStock,
                a.supplier_id
            ]

            const [result] = await con.query(sql, values);
            return result.insertId;
        } catch (error) {
            console.error("Erreur BDD lors de la création d'un article");

            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    }
}
export {dbArticles};
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
            JOIN suppliers s ON a.supplier_id = s.id
            WHERE a.status=true
            ORDER BY s.id`

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
                `INSERT INTO articles
                (refArticle, name, description, buyPrice, salePrice,actualStock, minStock, supplier_id)
                VALUES (?,?,?,?,?,?,?,?)`;

            const values = [
                articles.refArticle,
                articles.name,
                articles.description,
                articles.buyPrice,
                articles.salePrice,
                articles.actualStock,
                articles.minStock,
                articles.supplier_id
            ]

            const [result] = await con.query(sql, values);
            return result.insertId;
        } catch (error) {
            console.error("Erreur BDD lors de la création d'un article");

            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    updateArticles : async (id,updates) =>{
        let con;
        try {
            con = await db.connectToDatabase();

            // Crate a table with only column name
            const keys = Object.keys(updates);

            // List's column to modify dynamiquely : "refSuppliers = ?, name = ?, ..."
            const setClause = keys.map(column => `${column} = ?`).join(', ');

            // prepare new value
            const values = Object.values(updates);

            values.push(id);

            const sql = `UPDATE articles SET ${setClause}
                 WHERE id = ?;`

            const [result] = await con.query(sql, values);
            return {
                found : result.affectedRows > 0,
                changed : result.changedRows > 0
            };
        } catch (error) {
            console.error("Erreur dans updateArticlers :",error.message);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    }
}
export {dbArticles};
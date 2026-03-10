import {db} from './database.js'

const dbSuppliers = {
    getAllSuppliers : async () =>{
        let con;
        try {
            con = await db.connectToDatabase();
            const sql = `SELECT * FROM suppliers`
            const [rows] = await con.query(sql);
            return rows;
        } catch (error) {
            console.log("Erreur SQL lors de la récupération :",error.message);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },
    createSuppliers : async (suppliers) =>{
        let con;
        try {
            con = await db.connectToDatabase();
            const sql =
                `INSERT INTO suppliers
                (refSupplier, name, address, locality, NPA)
                VALUES (?,?,?,?,?)`;

            const values = [
                suppliers.refSupplier,
                suppliers.name,
                suppliers.address,
                suppliers.locality,
                suppliers.NPA
            ]

            const [result] = await con.query(sql, values);
            return result.insertId;
        } catch (error) {
            console.error("Erreur BDD lors de la création d'un fournisseur");

            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    // Help by Gemini for Object.keys() and setClause
    updateSuppliers : async (id,updates) =>{
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

            const sql = `UPDATE suppliers SET ${setClause}
                 WHERE id = ?;`

            const [result] = await con.query(sql, values);
            return {
                found : result.affectedRows > 0,
                changed : result.changedRows > 0
            };
        } catch (error) {
            console.error("Erreur dans updateSuppliers :",error.message);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    }
}
export {dbSuppliers};
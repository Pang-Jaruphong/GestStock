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
    }
}
export {dbSuppliers};
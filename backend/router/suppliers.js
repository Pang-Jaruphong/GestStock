import express from 'express';
import {dbSuppliers} from '../db/dbSuppliers.js';

const suppliersRouter = express.Router();

suppliersRouter.get('/', async (req, res) => {
    try {
        const suppliers = await dbSuppliers.getAllSuppliers();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({error:"Impossible de connexion de la base de données"});
    }
})

export default suppliersRouter;
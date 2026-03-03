import express from 'express';
import {dbOrders} from '../db/dbOrders.js';

const ordersRouter = express.Router();

ordersRouter.get('/', async (req, res) => {
    try {
        const orders = await dbOrders.getAllOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({error:"Impossible de connexion de la base de données"});
    }
})

export default ordersRouter;
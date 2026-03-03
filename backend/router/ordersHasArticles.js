import express from 'express';
import {dbOrdersHasArticles} from '../db/dbOrdersHasArticles.js';

const ordersHasArticlesRouter = express.Router();

ordersHasArticlesRouter.get('/', async (req, res) => {
    try {
        const ordersHasArticles = await dbOrdersHasArticles.getAllOrdersHasArticles();
        res.json(ordersHasArticles);
    } catch (error) {
        res.status(500).json({error:"Impossible de connexion de la base de données"});
    }
})

export default ordersHasArticlesRouter;
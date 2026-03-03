import express from 'express';
import {dbArticles} from '../db/dbArticles.js';

const articlesRouter = express.Router();

articlesRouter.get('/', async (req, res) => {
    try {
        const articles = await dbArticles.getAllArticles();
        res.json(articles);
    } catch (error) {
        res.status(500).json({error:"Impossible de connexion de la base de données"});
    }
})

articlesRouter.post('/', async (req, res) => {
    try {
        const newArticle = req.body;

    }
})

export default articlesRouter;
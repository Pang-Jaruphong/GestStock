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
        const requiredFields = [
            "refArticle",
            "name",
            "description",
            "buyPrice",
            "sellPrice",
            "actualStock",
            "minStock",
            "supplier_id"
        ];

        const missingFields = requiredFields.filter(field =>
            newArticle[field] === undefined ||
            newArticle[field] === null ||
            newArticle[field] === "");

        if (missingFields.length > 0) {
            return res.status(400).json({
                error:`Champs manquants: ${missingFields.join(', ')}`,
            })
        }

        if (isNaN(newArticle.buyPrice) || isNaN(newArticle.sellPrice) ||
            isNaN(newArticle.actualStock) || isNaN(newArticle.minStock)) {
            return res.status(400).json({
                error: "Les prix et la quantité doivent être numérique"
            })
        }

        const articleId  = await dbArticles.createArticles(newArticle);

        res.status(201).json({
            message: "Article créé avec succès",
            id: articleId,
            data: newArticle
        });
    } catch (error) {
        console.error("Erreur lors de la création d'un article",error)

        return res.status(500).json({
            error: "Erreur du serveur"
        });
    }
})

export default articlesRouter;
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

// Help by Gemini for some gestion error : format number, compare price, ref double
// Add new article
articlesRouter.post('/', async (req, res) => {
    try {
        const newArticle = req.body;
        const requiredFields = [
            "refArticle",
            "name",
            "description",
            "buyPrice",
            "salePrice",
            "actualStock",
            "minStock",
            "supplier_id"
        ];

        // If field est missing
        const missingFields = requiredFields.filter(field =>
            newArticle[field] === undefined ||
            newArticle[field] === null ||
            newArticle[field] === "");

        if (missingFields.length > 0) {
            return res.status(400).json({
                error:`Champs manquants: ${missingFields.join(', ')}`,
            })
        }

        // Fields must be number for the price and stock
        if (isNaN(newArticle.buyPrice) || isNaN(newArticle.salePrice) ||
            isNaN(newArticle.actualStock) || isNaN(newArticle.minStock)) {
            return res.status(400).json({
                error: "Les prix et la quantité doivent être numérique"
            })
        }

        // Verify buyPrice and sellPrice
        const isPriceLower = parseFloat(newArticle.salePrice) < parseFloat(newArticle.buyPrice)

        if (isPriceLower) {
            return res.status(409).json({
                warning : "price warning",
                message : "Attention! le prix de vente est inférieur au prix d'achat. Voulez-vous vraiment continuer?"
            })
        }

        const articleId  = await dbArticles.createArticles(newArticle);

        res.status(201).json({
            message: `L'article ${newArticle.name} a correctement été crée avec succès`,
            id: articleId,
            data: newArticle
        });
        // RefArticle existe
    } catch (error) {
        if (error.name === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return res.status(409).json({
                error : "duplicate ref",
                message : `La référence ${req.body.refArticle} existe déjà dans le système `
            })
        }

        // The foreign key doesn't existe
        if (error.errno === 1452){
            return res.status(400).json({
                error : "invalid supplier",
                message : "Le fournisseur n'existe pas"
            })
        }

        console.error("Erreur lors de la création d'un article",error)

        return res.status(500).json({
            error: "Erreur du serveur"
        });
    }
})

export default articlesRouter;
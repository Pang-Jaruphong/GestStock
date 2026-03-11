import express from 'express';
import {dbArticles} from '../db/dbArticles.js';
import {dbSuppliers} from "../db/dbSuppliers.js";

const articlesRouter = express.Router();

articlesRouter.get('/', async (req, res) => {
    try {
        const articles = await dbArticles.getAllArticles();
        res.json(articles);
    } catch (error) {
        res.status(500).json({error:"Impossible de connexion de la base de données"});
    }
})

// Help by Gemini for some gestion error : format number, compare price
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

        // If field is missing
        const missingFields = requiredFields.filter(field =>
            newArticle[field] === undefined ||
            newArticle[field] === null ||
            newArticle[field] === "");

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Champs manquants: ${missingFields.join(', ')}`,
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
                warning: "price warning",
                message: "Attention! le prix de vente est inférieur au prix d'achat. Voulez-vous vraiment continuer?"
            })
        }

        const articleId = await dbArticles.createArticles(newArticle);

        res.status(201).json({
            message: `L'article ${newArticle.name} a correctement été crée avec succès`,
            id: articleId,
            data: newArticle
        });
        // RefArticle existe
    } catch (error) {
        if (error.name === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return res.status(409).json({
                error: "Doublon ref",
                message: `La référence ${req.body.refArticle} existe déjà dans le système `
            })
        }

        // The foreign key doesn't existe
        if (error.errno === 1452) {
            return res.status(400).json({
                error: "invalid supplier",
                message: "Le fournisseur n'existe pas"
            })
        }

        console.error("Erreur lors de la création d'un article", error)

        return res.status(500).json({
            error: "Erreur du serveur"
        });
    }
});

articlesRouter.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; // Change only field modified

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                error : "Invalide id",
                message : "L'identifiant invalide."
            });
        }

        if (updates.buyPrice !== undefined && isNaN(parseFloat(updates.buyPrice )) ||
            updates.salePrice !== undefined && isNaN(parseFloat(updates.salePrice)) ||
            updates.actualStock !== undefined && isNaN(parseInt(updates.actualStock)) ||
            updates.minStock !== undefined && isNaN(parseInt(updates.minStock))
        ){
            return res.status(400).json({
                error : "Invalide format",
                message : "Le champ doit être numérique"
            });
        }

        const keys = Object.keys(updates);
        const optionFileds = ['description'];

        // If information is empty
        // Help by Gemini before if field{} is work and BDD is empty
        const hasEmptyField = keys.some((key) => {
            // Gemini for column can be null
            if (optionFileds.includes(key))
                return false;
            return updates[key] !== undefined && updates[key].toString().trim() === "";
        });
        if (hasEmptyField) {
            return res.status(400).json({
                error : "Invalide data",
                message : "Les champs ne peuvent pas être vide"
            })
        }

        const result = await dbArticles.updateArticles(id, updates);

        if (!result) {
            return res.status(404).json({
                error : "Article non trouvé",
                message : "L'article n'a pas trouvé"
            })
        }

        // Emptry information
        if (!result.found){
            return res.status(404).json({
                error : "Intouvable" ,
                message : "L'article n'existe pas."
            })
        }

        if (!result.changed) {
            return res.status(200).json({
                message: "Aucune modification détectée : les données sont identiques."
            });
        }

        res.status(200).json({
            message : `L'article a été modifié`
        })

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return res.status(409).json({
                error : "Ce numéro de référence existe déjà, veuillez changer le référence"
            })
        }
        console.error("Erreur détaillée :", error)

        return res.status(500).json({
            error : "Erreur du serveur"
        });
    }
})

export default articlesRouter;
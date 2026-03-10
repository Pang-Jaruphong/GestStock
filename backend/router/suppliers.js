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
});

suppliersRouter.post('/', async (req, res) => {
    try {
        const newSupplier = req.body;
        const requiredFields = [
            "refSupplier",
            "name",
            "address",
            "locality",
            "NPA"
        ];

        const missingFields = requiredFields.filter(field =>
            newSupplier[field] === undefined ||
            newSupplier[field] === null ||
            newSupplier[field] === "");

        if (missingFields.length > 0) {
            return res.status(400).json({
                error : `Champs manquants : ${missingFields.join(", ")}`,
            })
        }

        if (isNaN(newSupplier.NPA)) {
            return res.status(400).json({
                error : "Le NPA doit être en format numérique"
            })
        }

        const supplierId = await dbSuppliers.createSuppliers(newSupplier);

        res.status(200).json({
            message : `Le fournisseur ${newSupplier.name} a correctement été ajouté`,
            id: supplierId,
            data : newSupplier
        });

    } catch (error) {
        if (error.name === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return res.status(409).json({
                error: "Doublon ref",
                message: `La référence du ${req.body.name} existe déjà`
            })
        }

        console.error("Erreur lors de la création d'un fournisseur", error)

        return res.status(500).json({
            error : "Erreur du serveur"
        });
    }
});

suppliersRouter.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; // Change only field modified

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                error : "Invalide id",
                message : "L'identifiant invalide."
            });
        }

        if (updates.NPA !== undefined && isNaN(parseInt(updates.NPA))){
            return res.status(400).json({
                error : "Invalide format",
                message : "Le NPA doit être un nombre"
            });
        }

        const keys = Object.keys(updates);

        // If information is empty
        // Help by Gemini before if field{} is work and BDD is empty
        const hasEmptyField = keys.some((key) =>
            updates[key] !== undefined && updates[key].toString().trim() === ""
        );
        if (hasEmptyField) {
            return res.status(400).json({
                error : "Invalide data",
                message : "Les champs ne peuvent pas être vide"
            })
        }

        const result = await dbSuppliers.updateSuppliers(id, updates);

        if (!result) {
            return res.status(404).json({
                error : "Fournisseur non trouvé",
                message : "Le Fournisseur n'a pas trouvé"
            })
        }

        // Emptry information
        if (!result.found){
            return res.status(404).json({
                error : "Intouvable" ,
                message : "Le fournisseur n'existe pas."
            })
        }

        if (!result.changed) {
            return res.status(200).json({
                message: "Aucune modification détectée : les données sont identiques."
            });
        }

        res.status(200).json({
            message : `Le fournisseur a été modifié`
        })

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return res.status(409).json({
                error : "Ce numéro de référence existe déjà, veuillez changer le numéro"
            })
        }
        console.error("Erreur détaillée :", error)

        return res.status(500).json({
            error : "Erreur du serveur"
        });
    }
})

export default suppliersRouter;
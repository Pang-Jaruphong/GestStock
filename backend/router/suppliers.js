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
})

export default suppliersRouter;
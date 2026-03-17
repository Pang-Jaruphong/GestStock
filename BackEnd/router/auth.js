import express from 'express';
import { dbAuth } from '../db/dbAuth.js';

const authRouter = express.Router();

// Reinitialise le password via token
authRouter.post('/resetPassword', async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password || password < 6) {
        return res.status(400).json({message : 'Données invalides'})
    }
    try {
        const user = await dbAuth.findUserByToken(token);
        if (!user) {
            return res.status(404).json({massage: 'Données invalide'});
        }
        await dbAuth.activatePassword(user.id, password);
        return res.status(200).json({message: 'Mot de passe est mis à jour !'});
    } catch (error) {
            res.status(500).json({ massage : 'Erreur serveur' });
        }
});

export default authRouter;
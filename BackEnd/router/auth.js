import express from 'express';
import { dbAuth } from '../db/dbAuth.js';
import nodemailer from 'nodemailer';
import 'dotenv/config';

const authRouter = express.Router();

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASS
    }
});

authRouter.post('/forget-password', async (req, res) => {
    const { mail } = req.body;
    try {
        const token = await dbAuth.generateResetToken(mail);
        if (!token)
            return res.status(404).json({ message: "utilisateur non trouvé"});

        const lik = `http://localhost:5000/frontend/page/resetPassword.html?token=${token}`

        await transport.sendMail({
            from: '"Gestion Stock" <noreply@gestionstock.com>',
            to: mail,
            subject: "Création de votre mot de passe",
            html: `<p>Bienvenue ! Cliquez ici pour créer votre mot de passe : <a href="${link}">${link}</a></p>`
        });

        res.json({ message: "Email envoyé !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'envoi" });
    }
});

// Reinitialise le password via token
authRouter.post('/resetPassword', async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password || password < 6) {
        return res.status(400).json({message : 'Données invalides'})
    }
    try {
        const user = await dbAuth.findUserByToken(token);
        if (!user) {
            return res.status(404).json({message: 'Données invalide'});
        }
        await dbAuth.activatePassword(user.id, password);
        return res.status(200).json({message: 'Mot de passe est mis à jour !'});
    } catch (error) {
            res.status(500).json({ massage : 'Erreur serveur' });
        }
});

export default authRouter;
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
        pass: process.env.EMAIL_PASS
    }
});

authRouter.post('/forget-password', async (req, res) => {
    const { mail } = req.body;
    try {
        const token = await dbAuth.generateResetToken(mail);
        console.log("Token généré :", token);
        if (!token)
            return res.status(404).json({ message: "utilisateur non trouvé"});

        const link = `http://localhost:5000/resetPassword.html?token=${token}&mail=${mail}`;

        await transport.sendMail({
            from: '"Gestion Stock" <noreply@gestionstock.com>',
            to: mail,
            subject: "Création de votre mot de passe",
            html: `<p>Bienvenue ! Cliquez ici pour créer votre mot de passe : <a href="${link}">Créer le mot de passe</a></p>`
        });

        res.json({ message: "Email envoyé avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'envoi" });
    }
});

// Reinitialise le password via token
authRouter.post('/resetPassword', async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password || password.length < 6) {
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

authRouter.post('/login', async (req, res) => {
    const { mail, password } = req.body;

    try {
        const user = await dbAuth.findUserByMail(mail);

        if (!user) {
            res.status(401).json({message: 'Email incorrect'});
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(401).json({message: 'Email ou le mot de passe incorrect.'});
            return;
        }
        res.status(200).json({message: "Bienvenue !", user: {mail: user.email}});
    } catch (error) {
        res.status(500).json({ massage : 'Erreur serveur' });
    }
})
export default authRouter;
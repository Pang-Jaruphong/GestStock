import express from 'express';
import {dbUsers} from '../db/dbUsers.js';

const usersRouter = express.Router();

usersRouter.get('/', async (req, res) => {
    try {
        const users = await dbUsers.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({error:"Impossible de connexion de la base de données"});
    }
})

export default usersRouter;
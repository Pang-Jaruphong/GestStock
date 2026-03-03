import express from 'express';
import {dbStories} from '../db/dbStories.js';

const storiesRouter = express.Router();

storiesRouter.get('/', async (req, res) => {
    try {
        const stories = await dbStories.getAllStories();
        res.json(stories);
    } catch (error) {
        res.status(500).json({error:"Impossible de connexion de la base de données"});
    }
})

export default storiesRouter;
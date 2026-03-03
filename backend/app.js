import express from 'express';
import cors from 'cors';

import usersRouter from "./router/users.js";
import articlesRouter from "./router/articles.js";
import suppliersRouter from "./router/suppliers.js";


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/suppliers', suppliersRouter);

app.get('/', (req, res)=>{
    res.send('Système de gestion des stocks et des inventaires');
});

app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});
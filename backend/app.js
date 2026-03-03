import express from 'express';
import cors from 'cors';

import usersRouter from "./router/users.js";
import articlesRouter from "./router/articles.js";
import suppliersRouter from "./router/suppliers.js";
import ordersRouter from "./router/orders.js";
import storiesRouter from "./router/stories.js";
import ordersHasArticlesRouter from "./router/ordersHasArticles.js";


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/suppliers', suppliersRouter);
app.use('/orders', ordersRouter);
app.use('/stories', storiesRouter);
app.use('/ordersHasArticles', ordersHasArticlesRouter);

app.get('/', (req, res)=>{
    res.send('Système de gestion des stocks et des inventaires');
});

app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});
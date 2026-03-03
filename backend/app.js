import express from 'express';


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());


app.get('/', (req, res)=>{
    res.send('Système de gestion des stocks et des inventaires');
});

app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});
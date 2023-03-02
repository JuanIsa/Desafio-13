'use strict';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import carritoRoute from './routes/carrito.js';
import productosRoute from './routes/productos.js';
import usersRoute from './routes/users.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8080;

//Midlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(__dirname + '/public'));
app.use('/auth/login',express.static(__dirname + '/public'));
app.use('/auth/register',express.static(__dirname + '/public'));
app.use('/home',express.static(__dirname + '/public'));

//ROUTES
app.use('/api/productos', productosRoute);
app.use('/api/carrito', carritoRoute);
app.use('/users', usersRoute);


//RUTA 404
app.use('*', (req, res) => {
    res.status(404).json({ error: -2, descripcion: `ruta:${req.url}`, método: `${req.method} no implementado.`});
});

//ESCUCHA DEL SERVER
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto: ${PORT}.`);
});
'use strict';
import { Router } from 'express';
import Carrito from '../dao/filesystem/handlerCarrito.js';

const productosRoute = Router();
const archivo = new Carrito('carrito.txt');

//Ingresar un carrito nuevo.
productosRoute.post('/', (req, res) => {
    archivo.saveCart(req.body).then(dataFile => res.json(dataFile));
});

//Borrar un carrito por ID.
productosRoute.delete('/:id', (req, res) => {
    archivo.deleteCartById(parseInt(req.params.id)).then(dataFile => res.send(dataFile));
});

//Obtener productos de un carrito por ID.
productosRoute.get('/:id/productos', (req, res) => {
    archivo.getProductsByIdCart(parseInt(req.params.id)).then(dataFile => res.json(dataFile));
});

//Ingresar productos en un carrito por ID.
productosRoute.post('/:id/productos', (req, res) => {
    archivo.updateCartById(parseInt(req.params.id), req.body).then(dataFile => res.json(dataFile));
});

//Borrar un producto por su id en un carrito determinado por su ID.
productosRoute.delete('/:id/productos/:id_prod', (req, res) => {
    archivo.deleteProcdutcByIdWithIdCart(parseInt(req.params.id), parseInt(req.params.id_prod)).then(dataFile => res.json(dataFile));
});



export default productosRoute;
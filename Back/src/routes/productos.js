'use strict';
import { Router } from 'express';
import Productos  from '../dao/filesystem/handlerProductos.js';

const productosRoute = Router();
const archivo = new Productos('productos.txt');

//MIDLEWARE de protección de rutas.
const authEndpoints = (req, res, next) => {
    if (req.headers.administrador) {
        JSON.parse(req.headers.administrador) ? next() : res.status(401).json({ error: 'no autorizado', descripcion: `ruta:${req.url}`, método: `${req.method}`, statusCode: 401 })
    } else {
        res.status(401).json({ error: 'no autorizado', descripcion: `ruta:${req.url}`, método: `${req.method}`, statusCode: 401 })
    }
}

//Obtener la lista completa de archivos.
productosRoute.get('/', (req, res) => {
    archivo.getAll().then(dataFile => res.send(dataFile));
});

//Obtener registro por ID.
productosRoute.get('/:id', (req, res) => {
    archivo.getById(parseInt(req.params.id)).then(dataFile => res.send(dataFile));
});

//Ingresar un registro nuevo.
productosRoute.post('/', authEndpoints, (req, res) => {
    archivo.save(req.body).then(dataFile => res.send(dataFile));
});

//Modificar un registro por ID.
productosRoute.put('/:id', authEndpoints, (req, res) => {
    archivo.updateById(parseInt(req.params.id), req.body).then(dataFile => res.send(dataFile));
});

//Borrar un registro  por ID.
productosRoute.delete('/:id', authEndpoints, (req, res) => {
    archivo.deleteById(parseInt(req.params.id)).then(dataFile => res.send(dataFile));
});

export default productosRoute;
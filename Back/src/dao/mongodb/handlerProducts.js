import mongoose from 'mongoose';
import userModel from './models/modelProducts.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.set('strictQuery', false);
const connection = mongoose.connect(process.env.URLMONGODBCONNECT)
    .then(() => console.log('Conectado a base de datos mongo atlas productos.'))
    .catch(e => console.log(e));

class Productos {
    constructor(nameFile) {
        this.nameFile = nameFile;
    }
    async save(objeto) {
        const createData = await userModel.create({
            nombre: objeto.nombre,
            descripcion: objeto.descripcion,
            codigo: objeto.codigo,
            foto: objeto.foto,
            precio: objeto.precio,
            stock: objeto.stock
        })
            .then(data => data)
            .catch(e => {
                return ({Error: e})
            });
        return createData;
    }
    async getAll() {
        const dataFromDB = await userModel.find();
        return dataFromDB;
    }
    async getById(id) {
        const dataId = await userModel.findById(id)
            .then(data => data)
            .catch(e => {
                return ({ Error: e })
            });
        return dataId;
    }
    async updateById(id, producto) {
        const update = await userModel.findOneAndUpdate({ _id: id }, {
            $set: {
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                codigo: producto.codigo,
                foto: producto.foto,
                precio: producto.precio,
                stock: producto.stock

            }
        })
            .then(data => data)
            .catch(e => {
                return ({ Error: e })
            });
        return update;
    }
    async deleteById(id) {
        const deleteDocument = await userModel.findOneAndRemove({ _id: id })
            .then(data => data)
            .catch(e => {
                return ({ Error: e })
            });
        return deleteDocument;
    }
}

export default Productos;
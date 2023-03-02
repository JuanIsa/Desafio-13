import mongoose from "mongoose";

const collection = 'Products';

const schema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    codigo: Number,
    foto: String,
    precio: Number,
    stock: Number
}, {versionKey:false});

const userModel = mongoose.model(collection, schema);

export default userModel;
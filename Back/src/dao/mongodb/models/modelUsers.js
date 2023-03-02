import mongoose from "mongoose";

const collection = 'users2023';

const schema = new mongoose.Schema({
    email: {
        type: String,
        require:true,
        unique: true
    },
    password: {
        type: String,
        require:true
     }
}, { versionKey: false });

const userModel = mongoose.model(collection, schema);

export default userModel;
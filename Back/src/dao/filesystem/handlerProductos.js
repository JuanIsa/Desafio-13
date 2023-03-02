'use strict';
import fs from 'fs';

class Productos {
    constructor(nameFile) {
        this.nameFile = nameFile;
        this.fileInfo=[]
    }
    //VERIFICADOR DE ID
    async verifyId() {
        try {
            const fileRead = await fs.promises.readFile(`./src/dao/filesystem/${this.nameFile}`, 'utf-8');
            this.fileInfo = JSON.parse(fileRead);
        } catch (error) {
            console.log(`Hubo un error: ${error}`);
        }
    }
    //AGREGAR UN REGISTRO NUEVO
    async save(objeto) {
        let producto = {};
        await this.verifyId();
        try {
            if (this.fileInfo.length > 0) {
                producto = {
                    id: this.fileInfo[this.fileInfo.length - 1].id + 1,
                    timestamp: new Date(),
                    ...objeto,
                }
                this.fileInfo.push(producto);
            } else {
                producto = {
                    id: 1,
                    timestamp: new Date(),
                    ...objeto,
                }
                this.fileInfo.push(producto);
            }
            await fs.promises.writeFile(`./src/dao/filesystem/${this.nameFile}`, JSON.stringify(this.fileInfo), 'utf-8');
        } catch (error) {
            return `Hubo un error: ${error}`;
        }
        return producto;
    }
    //OBTENER REGISTRO POR ID
    async getById(id) {
        let find;
        try {
            const fileRead = await fs.promises.readFile(`./src/dao/filesystem/${this.nameFile}`, 'utf-8');
            this.fileInfo = JSON.parse(fileRead);
            find = this.fileInfo.find(item => item.id === parseInt(id));
            if (find) {
                return find;
            } else {
                return { error: 'Producto no encontrado.' };
            }
        } catch (error) {
            return `Hubo un error: ${error}`;
        }
    }
    //ACTUALIZAR REGISTRO POR ID
    async updateById(id, producto) {
        let index;
        try {
            const fileRead = await fs.promises.readFile(`./src/dao/filesystem/${this.nameFile}`, 'utf-8');
            this.fileInfo = JSON.parse(fileRead);
            index = this.fileInfo.findIndex(item => item.id === parseInt(id));
            if (index !== -1) {
                this.fileInfo[index] = {
                    id: this.fileInfo[index].id,
                    ...producto
                }
                await fs.promises.writeFile(`./src/dao/filesystem/${this.nameFile}`, JSON.stringify(this.fileInfo), 'utf-8');
                return { success:'Registro modificado con éxito.'};
            } else {
                return { error: 'Producto no encontrado.'};
            }
        } catch (error) {
            return `Hubo un error: ${error}.`;
        }
    }
    //OBTENER PRODUCTO ALEATORIO
    async getRandomProduct() {
        try {
            const fileRead = await fs.promises.readFile(`./src/dao/filesystem/${this.nameFile}`, 'utf-8');
            this.fileInfo = JSON.parse(fileRead);
            return this.fileInfo[Math.floor(Math.random() * this.fileInfo.length)];
        } catch (error) {
            console.log(`Hubo un error: ${error}`);
            return null;
        }
    }
    //OBTENER TODOS LOS REGISTROS
    async getAll() {
        try {
            const fileRead = await fs.promises.readFile(`./src/dao/filesystem/${this.nameFile}`, 'utf-8');
            this.fileInfo = JSON.parse(fileRead);
            return this.fileInfo;
        } catch (error) {
            return `Hubo un error: ${error}`;
        }
    }
    //BORRAR REGISTRO POR ID
    async deleteById(id) {
        try {
            const fileRead = await fs.promises.readFile(`./src/dao/filesystem/${this.nameFile}`, 'utf-8');
            this.fileInfo = JSON.parse(fileRead);
            if (this.fileInfo.find(item => item.id === parseInt(id))) {
                this.fileInfo = this.fileInfo.filter(item => item.id !== id);
                await fs.promises.writeFile(`./src/dao/filesystem/${this.nameFile}`, JSON.stringify(this.fileInfo), 'utf-8');
                return {success: `Se borró el registro: ${id}`};
            } else {
                return { error: `No existe el registro: ${id}, no se pudo borrar.` };
            }
        } catch (error) {
            return `Hubo un error: ${error}`;
        }
    }
    //BORRAR TODOS LOS REGISTROS    
    async deleteAll() {
        await fs.promises.writeFile(`./src/dao/filesystem/${this.nameFile}`, JSON.stringify([]), 'utf-8');
        console.log('Se borraron todos los objetos del archivo.')
    }
}
export default Productos;
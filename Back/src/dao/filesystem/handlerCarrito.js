'use strict';
import fs from 'fs';


class Carrito {
    constructor(nameFile) {
        this.nameFile = nameFile;
        this.fileInfo = []
    }
     
    async verifyId() {
        try {
            const fileRead = await fs.promises.readFile(`./src/resources/${this.nameFile}`, 'utf-8');
            this.fileInfo = JSON.parse(fileRead);
        } catch (error) {
            console.log(`Hubo un error: ${error}`);
        }
    }
        
    async saveCart(objet) {
        let cart = {};
        let idCart = 0;
        await this.verifyId();
        try {
            if (this.fileInfo.length > 0) {
                idCart = this.fileInfo[this.fileInfo.length - 1].id + 1
                cart = {
                    id: idCart,
                    timestamp: new Date(),
                    productos: [objet],
                }
                this.fileInfo.push(cart);
            } else {
                idCart = 1;
                cart = {
                    id: idCart,
                    timestamp: new Date(),
                    productos: [objeto],
                }
                this.fileInfo.push(cart);

            }
            await fs.promises.writeFile(`./src/resources/${this.nameFile}`, JSON.stringify(this.fileInfo), 'utf-8');
            return idCart;
        } catch (error) {
            return `Hubo un error: ${error}`;
        }
    }
    async deleteCartById(id) {
        try {
            const fileRead = await fs.promises.readFile(`./src/resources/${this.nameFile}`, 'utf-8');
            this.fileInfo = JSON.parse(fileRead);
            if (this.fileInfo.find(item => item.id === id)) {
                this.fileInfo = this.fileInfo.filter(item => item.id !== id);
                await fs.promises.writeFile(`./src/resources/${this.nameFile}`, JSON.stringify(this.fileInfo), 'utf-8');
                return `Se borró el carrito con id: ${id}`;
            } else {
                return { error: `No existe el carrito ${id}, no se pudo borrar.` };
            }
        } catch (error) {
            return `Hubo un error: ${error}`;
        }
    }
    async getProductsByIdCart(id) {
        let find;
        try {
            const fileRead = await fs.promises.readFile(`./src/resources/${this.nameFile}`, 'utf-8');
          
            this.fileInfo = JSON.parse(fileRead);
            find = this.fileInfo.find(item => item.id === id);
            if (find) {
                return find.productos;
            } else {
                return { error: 'Carrito no encontrado.' };
            }
        } catch (error) {
            return `Hubo un error: ${error}`;
        }
    }
    async updateCartById(id, producto) {
        let index;
        try {
            const fileRead = await fs.promises.readFile(`./src/resources/${this.nameFile}`, 'utf-8');
            this.fileInfo = JSON.parse(fileRead);
            index = this.fileInfo.findIndex(item => item.id === id);
            if (index !== -1) {
                this.fileInfo[index].productos.push(producto);
                await fs.promises.writeFile(`./src/resources/${this.nameFile}`, JSON.stringify(this.fileInfo), 'utf-8');
                return { sucess: 'Carrito modificado con éxito.'};
            } else {
                return { error: 'Carrito no encontrado.' };
            }
        } catch (error) {
            return `Hubo un error: ${error}.`;
        }
    }
    async deleteProcdutcByIdWithIdCart(id, id_prod) {
        let index;
        try {
            const fileRead = await fs.promises.readFile(`./src/resources/${this.nameFile}`, 'utf-8');
            this.fileInfo = JSON.parse(fileRead);
            index = this.fileInfo.findIndex(item => item.id === id);
            if (index !== -1) {
                if (this.fileInfo[index].productos.filter(item => item.id == id_prod).length > 0) {
                    this.fileInfo[index].productos = this.fileInfo[index].productos.filter(item => item.id !== id_prod);
                    await fs.promises.writeFile(`./src/resources/${this.nameFile}`, JSON.stringify(this.fileInfo), 'utf-8');
                    return 'Producto borrado con éxito del carrito.';
                } else {
                    return { error: 'Producto no encontrado.' };
                }
            } else {
                return { error: 'Carrito no encontrado.' };
            }
        } catch (error) {
            return `Hubo un error: ${error}.`;
        }
    }
}
export default Carrito;
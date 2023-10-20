import dotenv from 'dotenv';

import mongoose from 'mongoose';
import productsModelLogic from './mongo/products.mongo.js';
import cartModelLogic from './mongo/carts.mongo.js';
import ProductsMemory from './memory/ProductManager.js';
import CartsMemory from './memory/CartManager.js';

dotenv.config();

switch (config.persistence) {
    case 'MONGO':
        console.log('Mongo Persistance');
        mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@coderhouse.ai8ozim.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`);
        Products = productsModelLogic;
        Carts = cartModelLogic;
        break;

    case 'FILESYSTEM':
        console.log('Memory Persistance');
        Products = ProductsMemory;
        Carts = CartsMemory;
        break;

    default:
        break;
}

export { Products, Carts };
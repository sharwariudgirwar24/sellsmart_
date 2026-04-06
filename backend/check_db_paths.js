import mongoose from 'mongoose';
import { Product } from './model/productmodel.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const checkProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/SellSmart");
        console.log("Connected to MongoDB");
        const products = await Product.find({});
        console.log("Found products:", products.length);
        products.forEach(p => {
            console.log(`Product: ${p.name}`);
            console.log(`- Images: ${p.images?.[0]?.url}`);
            console.log(`- Video: ${p.video?.url}`);
        });
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

checkProducts();

import mongoose from 'mongoose';
import { Product } from './model/productmodel.js';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const p = await Product.findOne();
    console.log("Sample Product:", JSON.stringify(p, null, 2));
    process.exit(0);
}
check();

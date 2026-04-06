import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    console.log("Connecting to:", process.env.MONGO_URI);
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");
        
        const db = mongoose.connection.db;
        const products = await db.collection('products').find().toArray();
        console.log("All products:");
        console.log(JSON.stringify(products, null, 2));
        
    } catch (e) {
        console.error("Connection failed:", e);
    }
    process.exit(0);
}
check();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Vendor } from './model/vendormodel.js';

dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const vendors = await Vendor.find({});
        console.log('Vendors in DB:', vendors);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

test();

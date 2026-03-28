import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    vendorToken: {
        type: mongoose.Schema.ObjectId,
        ref: "Vendor",
        required: true,
    },
    name: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please enter product description"],
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
        max: [99999999, "Price cannot exceed 8 digits"],
    },
    category: {
        type: String,
        required: [true, "Please enter product category"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        max: [9999, "Stock cannot exceed 4 digits"],
        default: 1,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    views: {
        type: Number,
        default: 0,
    },
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            text: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Product = mongoose.model("Product", productSchema);

import mongoose from "mongoose";

const engagementSchema = new mongoose.Schema({
    vendorToken: {
        type: mongoose.Schema.ObjectId,
        ref: "Vendor",
        required: true,
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
    },
    type: {
        type: String,
        enum: ["view", "like", "comment"],
        required: true,
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Engagement = mongoose.model("Engagement", engagementSchema);

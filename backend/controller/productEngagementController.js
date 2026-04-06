import { Product } from "../model/productmodel.js";
import { Engagement } from "../model/engagementmodel.js";
import { createNotification } from "./notificationController.js";
import { catchAsyncErrors } from "../middleware/catchAsyncError.js";
import mongoose from "mongoose";

// Like or Unlike a product
export const likeProduct = catchAsyncErrors(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    const userId = req.user?._id || req.user?.id;

    // Check if user already liked the product
    const isLiked = product.likes.includes(userId);

    if (isLiked) {
        // Unlike
        product.likes = product.likes.filter(id => id.toString() !== userId.toString());
    } else {
        // Like
        product.likes.push(userId);
    }

    await product.save();

    if (!isLiked) {
        // Log Engagement
        await Engagement.create({
            vendorToken: new mongoose.Types.ObjectId(product.vendorToken.toString()),
            productId: new mongoose.Types.ObjectId(product._id.toString()),
            type: "like",
            userId: new mongoose.Types.ObjectId(userId.toString())
        });

        // Notify vendor
        await createNotification({
            recipient: product.vendorToken,
            recipientModel: "Vendor",
            sender: userId,
            senderModel: "User",
            type: "product_status",
            title: "New Like!",
            message: `${req.user.FullName} liked your product: ${product.name}`,
            link: `/vendor/posts`
        });
    }

    res.status(200).json({ success: true, message: isLiked ? "Unliked" : "Liked", likes: product.likes.length });
});

// Add a comment to a product
export const addComment = catchAsyncErrors(async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    const userId = req.user?._id || req.user?.id;

    const comment = {
        user: userId,
        name: req.user.FullName || "User",
        text
    };

    product.comments.push(comment);
    await product.save();

    // Log Engagement
    await Engagement.create({
        vendorToken: new mongoose.Types.ObjectId(product.vendorToken.toString()),
        productId: new mongoose.Types.ObjectId(product._id.toString()),
        type: "comment",
        userId: new mongoose.Types.ObjectId(userId.toString())
    });

    // Notify vendor
    await createNotification({
        recipient: product.vendorToken,
        recipientModel: "Vendor",
        sender: userId,
        senderModel: "User",
        type: "product_status",
        title: "New Comment!",
        message: `${req.user.FullName} commented on ${product.name}: "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}"`,
        link: `/vendor/posts`
    });

    res.status(200).json({ success: true, product });
});

// Increment view count for a product
export const incrementView = catchAsyncErrors(async (req, res) => {
    console.log("⚡ [Engagement] incrementView triggered for Product:", req.params.id);
    // We using findOneAndUpdate to increment and return the doc in one go
    const product = await Product.findByIdAndUpdate(
        req.params.id, 
        { $inc: { views: 1 } },
        { new: true, runValidators: false } // return updated, skip full validation if partial update
    );

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    console.log(`Logging view for product: ${product._id}, Vendor: ${product.vendorToken}`);
    await Engagement.create({
        vendorToken: new mongoose.Types.ObjectId(product.vendorToken.toString()),
        productId: new mongoose.Types.ObjectId(product._id.toString()),
        type: "view",
        userId: req.user?._id || req.user?.id ? new mongoose.Types.ObjectId((req.user?._id || req.user?.id).toString()) : undefined
    });

    res.status(200).json({ success: true, views: product.views });
});

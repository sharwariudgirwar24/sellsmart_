import { Product } from "../model/productmodel.js";

// Like or Unlike a product
export const likeProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Check if user already liked the product
        const isLiked = product.likes.includes(req.user.id);

        if (isLiked) {
            // Unlike
            product.likes = product.likes.filter(id => id.toString() !== req.user.id.toString());
        } else {
            // Like
            product.likes.push(req.user.id);
        }

        await product.save();
        res.status(200).json({ success: true, message: isLiked ? "Unliked" : "Liked", likes: product.likes.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add a comment to a product
export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ success: false, message: "Comment text is required" });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const comment = {
            user: req.user.id,
            name: req.user.FullName || "User",
            text
        };

        product.comments.push(comment);
        await product.save();

        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Increment view count for a product
export const incrementView = async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

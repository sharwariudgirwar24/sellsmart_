import { Product } from "../model/productmodel.js";
import fs from "fs";
import path from "path";

// Fetch vendor's products
export const getVendorProducts = async (req, res) => {
    try {
        const products = await Product.find({ vendorToken: req.vendor._id.toString() }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.error("Get Products Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
};

// Create a new product (Product upload API)
export const createProduct = async (req, res) => {
    try {
        const productData = {
            ...req.body,
            vendorToken: req.vendor._id.toString(),
            images: [],
            name: req.body.title || 'Untitled',
            description: req.body.description || '',
            price: Number(req.body.price) || 0,
            category: req.body.category || 'General',
            stock: 1
        };

        if (req.file) {
            const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            productData.images.push({
                public_id: req.file.filename,
                url: fileUrl
            });
        }

        const product = await Product.create(productData);

        res.status(201).json({
            success: true,
            product,
        });

    } catch (error) {
        console.error("Create Product Error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Server Error",
            stack: error.stack
        });
    }
};

// Delete a product (Product delete API)
export const deleteProduct = async (req, res) => {
    try {
        console.log("Delete Request for ID:", req.params.id);
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        console.log("Product Found. Vendor ID in Product:", product.vendorToken);
        console.log("Authenticated Vendor ID:", req.vendor._id);

        // Verify ownership
        if (product.vendorToken.toString() !== req.vendor._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized: You do not own this product" });
        }

        // Delete images from filesystem
        product.images.forEach(img => {
            const filePath = path.join("uploads", img.public_id);
            console.log("Attempting to delete image file:", filePath);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log("File deleted successfully");
            } else {
                console.log("File not found on disk, skipping deletion");
            }
        });

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error("Delete Product Error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Server Error",
            stack: error.stack 
        });
    }
};

// Update a product (Product update API)
export const updateProduct = async (req, res) => {
    try {
        console.log("Update Request for ID:", req.params.id);
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Verify ownership
        if (product.vendorToken.toString() !== req.vendor._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized: You do not own this product" });
        }

        const updatedData = {
            name: req.body.title || product.name,
            description: req.body.description || product.description,
            price: req.body.price ? Number(req.body.price) : product.price,
            category: req.body.category || product.category,
        };

        if (req.file) {
            console.log("New file uploaded for update, deleting old images...");
            // Delete old images
            product.images.forEach(img => {
                const filePath = path.join("uploads", img.public_id);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });

            const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            updatedData.images = [{
                public_id: req.file.filename,
                url: fileUrl
            }];
        }

        product = await Product.findByIdAndUpdate(req.params.id, updatedData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        console.error("Update Product Error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Server Error",
            stack: error.stack 
        });
    }
};

// Fetch all products (Public - for Customers) with searching and filtering
export const getAllProducts = async (req, res) => {
    try {
        const { keyword, category, minPrice, maxPrice } = req.query;
        let query = {};

        if (keyword) {
            query.name = { $regex: keyword, $options: "i" };
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.error("Get All Products Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error",
            error: error.message 
        });
    }
};


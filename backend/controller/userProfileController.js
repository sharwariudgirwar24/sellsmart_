import { User } from "../model/usermodel.js";
import fs from "fs";
import path from "path";

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const newUserData = {
            FullName: req.body.FullName,
            Email: req.body.Email,
            Phone: req.body.Phone,
        };

        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Save a vendor
export const saveVendor = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const vendorId = req.params.vendorId;

        if (user.savedVendors.includes(vendorId)) {
            return res.status(400).json({ message: "Vendor already saved" });
        }

        user.savedVendors.push(vendorId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Vendor saved!"
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Unsave a vendor
export const unsaveVendor = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const vendorId = req.params.vendorId;

        user.savedVendors = user.savedVendors.filter(id => id.toString() !== vendorId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Vendor unsaved!"
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get saved vendors
export const getSavedVendors = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'savedVendors',
            select: 'BusinessName Email Phone FullName category icon theme'
        });

        res.status(200).json({
            success: true,
            savedVendors: user.savedVendors
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update user avatar
export const updateUserAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload a file" });
        }

        const user = await User.findById(req.user.id);
        
        // Delete old avatar if exists
        if (user.avatar && user.avatar.public_id) {
            const oldPath = path.join("uploads", user.avatar.public_id);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        user.avatar = {
            public_id: req.file.filename,
            url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
        };

        await user.save();

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
// Delete user avatar
export const deleteUserAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (user.avatar && user.avatar.public_id) {
            const filePath = path.join("uploads", user.avatar.public_id);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        user.avatar = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Avatar deleted",
            user
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

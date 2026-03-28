import jwt from "jsonwebtoken";
import { User } from "../model/usermodel.js";
import { Vendor } from "../model/vendormodel.js";

// Verify User (Customer) Authenticated
export const isAuthenticatedUser = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Please log in to access this resource" });
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decodedData.id);

        if (!req.user) {
            return res.status(401).json({ message: "User not found, Invalid Token" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token, please log in again", error: error.message });
    }
};

// Verify Vendor Authenticated
export const isAuthenticatedVendor = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Please log in as a vendor to access this resource" });
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.vendor = await Vendor.findById(decodedData.id);

        if (!req.vendor) {
            return res.status(401).json({ message: "Vendor not found, Invalid Token" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token, please log in again", error: error.message });
    }
};

export const isAuthenticated = async (req, res, next) => {

    try {
        const { token } = req.cookies;
        if (!token) return res.status(401).json({ message: "Not authenticated" });

        const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        // Try User search
        req.user = await User.findById(decodedData.id);
        if (req.user) return next();

        // Try Vendor search
        req.vendor = await Vendor.findById(decodedData.id);
        if (req.vendor) return next();

        return res.status(401).json({ message: "Invalid session" });
    } catch (error) {
        return res.status(401).json({ message: "Authentication failed" });
    }
};


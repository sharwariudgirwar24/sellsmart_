import { Vendor } from "../model/vendormodel.js";

// Get vendor profile
export const getVendorProfile = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.vendor.id);
        
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        
        res.status(200).json({
            success: true,
            vendor,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update vendor profile
export const updateVendorProfile = async (req, res) => {
    try {
        const newVendorData = {
            FullName: req.body.FullName,
            BusinessName: req.body.BusinessName,
            Email: req.body.Email,
            Phone: req.body.Phone,
            category: req.body.category,
        };


        const vendor = await Vendor.findByIdAndUpdate(req.vendor.id, newVendorData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
            vendor,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

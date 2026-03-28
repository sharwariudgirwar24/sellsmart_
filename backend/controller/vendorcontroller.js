import { Vendor } from "../model/vendormodel.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/jwtToken.js";

export const VendorSignup = async (req, res) => {
    try {
        const { FullName, BusinessName, Phone, Email, password, category, location } = req.body || {};

        if (!FullName || !BusinessName || !Phone || !Email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        const vendorexist = await Vendor.findOne({
            $or: [{ Email }, { Phone }],
        });

        if (vendorexist) {
            return res.status(400).json({ message: "Vendor already exists, please login" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const vendor = await Vendor.create({
            FullName,
            BusinessName,
            Phone,
            Email,
            password: hashedPassword,
            category: category || "Fashion & Tailoring",
            location: location || "Pune, Maharashtra"
        });


        sendToken(vendor, 201, res, "Vendor registered successfully");

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const VendorLogin = async (req, res) => {
    try {
        const { Email, password } = req.body || {};

        if (!Email || !password) {
            return res.status(400).json({ message: "Please enter email or password" });
        }

        const vendor = await Vendor.findOne({ Email });
        if (!vendor) {
            return res.status(400).json({ message: "Vendor not found. Please signup" });
        }

        const isMatch = await bcrypt.compare(password, vendor.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        sendToken(vendor, 200, res, "Logged in successfully");
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Fetch all vendors (Public - for Customers) with search/filter
export const getAllVendors = async (req, res) => {
    try {
        const { keyword, category } = req.query;
        let query = {};

        if (keyword) {
            query.$or = [
                { BusinessName: { $regex: keyword, $options: "i" } },
                { FullName: { $regex: keyword, $options: "i" } }
            ];
        }


        if (category && category !== "All") {
            query.category = category;
        }

        const vendors = await Vendor.find(query).select("-password");
        res.status(200).json({
            success: true,
            vendors,
        });
    } catch (error) {
        console.error("Get All Vendors Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error" 
		});
	}
};



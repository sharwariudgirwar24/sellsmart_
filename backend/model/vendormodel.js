import mongoose from "mongoose";
import validator from "validator";

const vendordetail = new mongoose.Schema({
    FullName: {
        type: String,
        required: true,
        minlength: [3, "minimum 3 characters must be in full name"]
    },
    BusinessName: {
        type: String,
        required: true,
        minlength: [3, "minimum 3 characters must be in business name"]
    },
    Phone: {
        type: String,
        required: true,
        minlength: [10, "minimum 10 characters must be in phone"],
        maxlength: [15, "maximum 15 characters in phone"]
    },
    Email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "enter valid email"]
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters long"]
    },
    category: {
        type: String,
        default: "Fashion & Tailoring"
    },
    location: {
        type: String,
        default: "Pune, Maharashtra"
    }
});


export const Vendor = mongoose.model("Vendor", vendordetail, "vendors");

import mongoose from "mongoose"
import validator from "validator"



const userdetail=new mongoose.Schema({
    

    FullName:{
        type:String,
        required:true,
        minlength:[3,"minimum 3 character must be in first name"]
    },


   Email:{
        type:String,
        required:true,
        validate:[validator.isEmail,"enter valid email"]
    },
     
    Phone:{
        type:String,
        required:true,
        minlength:[10,"minimum 10 characters must be in phone"],
        maxlength:[15,"maximum 15 characters in phone "]
    },

    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters long"]
    },
    savedVendors: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Vendor"
        }
    ],
    avatar: {
        public_id: String,
        url: String
    }



})




export const User=mongoose.model("User",userdetail, "users")

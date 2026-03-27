import { User } from "../model/usermodel.js"
import bcrypt from "bcrypt"
import { sendToken } from "../utils/jwtToken.js"


export const UserSinup = async (req, res) => {

  try {

    console.log("Request Data:", req.body)

    const { FullName, Email, Phone, password } = req.body || {}

    // validation
    if (!FullName || !Email || !Phone || !password) {
      return res.status(400).json({
        message: "Please fill all fields"
      })
    }

    // check user already exist
    const userExist = await User.findOne({ Email })

    if (userExist) {
      return res.status(400).json({
        message: "User already exists, please login"
      })
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // create user
    const user = await User.create({
      FullName,
      Email,
      Phone,
      password: hashedPassword
    })

    // success response via sendToken
    sendToken(user, 201, res, "User registered successfully");

  } catch (error) {

    console.log("Signup Error:", error)

    return res.status(500).json({
      success: false,
      message: "Server Error"
    })

  }

}
export const Userlogin = async (req, res) => {
    try {
        const { Email, password } = req.body || {};

        if (!Email || !password) {
            return res.status(400).json({ message: "Please enter email and password" });
        }

        // Check user exist
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(400).json({ message: "User not found Please sinup" });
        }
          
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ 
                message: "Invalid password" 
            });
        }

        // ✅ Login Success via sendToken
        sendToken(user, 200, res, "Logged in successfully");
    } catch (error) {
        console.log("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

export const usergetbyid = async (req, res) => {
    try {
        // Fetch all users but select only specific fields
        const users = await User.find({}).select('FullName Phone Email');

        // Check if data exists
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        // Send filtered user data
        return res.status(200).json({ 
            message: "Users retrieved successfully", 
            data: users 
        });
    } catch (error) {
        // Handle any server errors
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};
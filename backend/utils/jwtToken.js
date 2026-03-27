import jwt from "jsonwebtoken";

export const sendToken = (user, statusCode, res, message) => {
    // Determine token expiration specifically using days
    const expiresIn = process.env.JWT_EXPIRES || "7d";
    
    // Create JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn
    });

    // Options for cookie
    const options = {
        expires: new Date(
            Date.now() + parseInt(process.env.COOKIE_PARSER || 7) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    // Remove password from output if present
    const userObj = user.toObject ? user.toObject() : user;
    if (userObj.password) delete userObj.password;

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        message,
        user: userObj,
        token
    });
};

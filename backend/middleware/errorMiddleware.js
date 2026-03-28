export class ErrorHandler extends Error{
    constructor (message,statuscode){
        super(message)
        this.statuscode=statuscode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statuscode = err.statuscode || 500;

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    if (err.name === "JsonWebTokenError") {
        const message = "JSON Web Token is invalid, try again";
        err = new ErrorHandler(message, 400);
    }

    if (err.name === "TokenExpiredError") {
        const message = "JSON Web Token has expired, try again";
        err = new ErrorHandler(message, 400);
    }

    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    return res.status(err.statuscode).json({
        success: false,
        message: err.message,
    });
};
import mongoose from "mongoose";

export const connectdb = () => {
  mongoose
    .connect(process.env.MONGO_URI)

    .then(() => {
      console.log("database Connection Successfully");
    })

    .catch((err) => {
      console.log("Database  Connection Error", err.message);
    });
};
//Zoya786786
//

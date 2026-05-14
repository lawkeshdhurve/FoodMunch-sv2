import mongoose from "mongoose";
import userModel from "./models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const fixUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected");
        const result = await userModel.updateMany({}, { $set: { isVerified: true } });
        console.log("Updated users:", result);
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

fixUsers();

import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/sendEmail.js";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// ── Login ─────────────────────────────────────────────────────
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        // if (!user.isVerified) {
        //     return res.json({
        //         success: false,
        //         message: "Please verify your email before logging in. Check your inbox!",
        //         needsVerification: true,
        //     });
        // }

        const token = createToken(user._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log("Login error:", error.message || error);
        res.json({ success: false, message: "Error" });
    }
};

// ── Register ──────────────────────────────────────────────────
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        // validate email and password first
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password (min 8 characters)" });
        }

        // check if user already exists
        const exists = await userModel.findOne({ email });

        if (exists && exists.isVerified) {
            // fully registered — just tell them to log in
            return res.json({ success: false, message: "Account already exists. Please log in." });
        }

        if (exists && !exists.isVerified) {
            // registered but never verified — resend the email
            const verifyToken = crypto.randomBytes(32).toString("hex");
            const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
            exists.verifyToken = verifyToken;
            exists.verifyTokenExpiry = verifyTokenExpiry;
            await exists.save();

            try {
                await sendVerificationEmail(email, verifyToken);
                return res.json({ success: true, message: "Verification email resent! Please check your inbox." });
            } catch (emailErr) {
                console.log("Email resend error:", emailErr.message || emailErr);
                return res.json({ success: false, message: `Email error: ${emailErr.message}` });
            }
        }

        // new user — hash password and create account
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verifyToken = crypto.randomBytes(32).toString("hex");
        const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            verifyToken,
            verifyTokenExpiry,
        });

        await newUser.save();

        // send verification email — if it fails, remove the user so they can try again cleanly
        try {
            await sendVerificationEmail(email, verifyToken);
            res.json({ success: true, message: "Verification email sent! Please check your inbox." });
        } catch (emailErr) {
            console.log("Email send error:", emailErr.message || emailErr);
            // rollback: delete the saved user so they aren't stuck
            await userModel.deleteOne({ _id: newUser._id });
            res.json({ success: false, message: `Could not send email: ${emailErr.message}` });
        }

    } catch (error) {
        console.log("Register error:", error.message || error);
        res.json({ success: false, message: "Something went wrong. Please try again." });
    }
};

// ── Verify Email ──────────────────────────────────────────────
const verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
        if (!token) {
            return res.json({ success: false, message: "Invalid verification link" });
        }

        const user = await userModel.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: new Date() },
        });

        if (!user) {
            return res.json({ success: false, message: "Verification link is invalid or has expired" });
        }

        // mark as verified and clear token
        user.isVerified = true;
        user.verifyToken = null;
        user.verifyTokenExpiry = null;
        await user.save();

        const authToken = createToken(user._id);
        res.json({ success: true, token: authToken, message: "Email verified successfully!" });

    } catch (error) {
        console.log("Verify error:", error.message || error);
        res.json({ success: false, message: "Error verifying email" });
    }
};

export { loginUser, registerUser, verifyEmail };
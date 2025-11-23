const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// Initialize the Google Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async(req, res) => {
    try {
        const { token } = req.body;

        // --- DEBUG LOGS (Check your VS Code Terminal when you login) ---
        console.log("------------------------------------------------");
        console.log("DEBUG: Login Request Received");
        console.log("DEBUG: Token from Frontend:", token ? (token.substring(0, 15) + "...") : "UNDEFINED / NULL");
        console.log("DEBUG: Client ID from .env:", process.env.GOOGLE_CLIENT_ID);
        // -------------------------------------------------------------

        if (!token) {
            console.log("DEBUG ERROR: Token is missing!");
            return res.status(400).json({ success: false, message: "No token provided" });
        }

        // Verify the token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log("DEBUG: Verification Successful! User:", payload.email);

        const { email, name, picture } = payload;

        // 2. Check if user exists in DB
        let user = await User.findOne({ email });

        if (!user) {
            console.log("DEBUG: Creating new user...");
            user = await User.create({
                name,
                email,
                image: picture,
                password: Math.random().toString(36).slice(-8), // Dummy password for Google users
            });
        } else {
            console.log("DEBUG: User found in DB.");
        }

        // 3. Generate JWT Token
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.status(200).json({
            success: true,
            token: jwtToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image
            },
        });

    } catch (error) {
        console.log("------------------------------------------------");
        console.error("DEBUG ERROR: Verification Failed:", error.message);
        console.log("------------------------------------------------");
        res.status(401).json({ success: false, message: "Invalid Token" });
    }
};

module.exports = { googleLogin };
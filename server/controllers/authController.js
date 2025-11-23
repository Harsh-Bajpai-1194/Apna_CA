const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// Initialize the Google Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async(req, res) => {
    try {
        const { token } = req.body;

        // 1. Check if token is present
        if (!token) {
            return res.status(400).json({ success: false, message: "No token provided" });
        }

        // 2. Verify the Google Token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        // Google sends the unique user ID in the 'sub' field
        const { email, name, picture, sub } = payload;

        // 3. Check if user exists in DB
        let user = await User.findOne({ email });

        if (!user) {
            // 4. Create new user if they don't exist
            console.log("Creating new user:", email);
            user = await User.create({
                name,
                email,
                image: picture,
                googleId: sub, // <--- IMPORTANT: This satisfies your Schema requirement
                password: Math.random().toString(36).slice(-8), // Dummy password for Google users
            });
        }

        // 5. Generate JWT Token (for your app)
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        // 6. Send success response
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
        console.error("Google Login Error:", error.message);
        res.status(401).json({ success: false, message: "Invalid Token" });
    }
};

module.exports = { googleLogin };
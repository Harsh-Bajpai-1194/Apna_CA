const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Initialize Google Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Auth user with Google
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async(req, res) => {
    const { id_token } = req.body;

    try {
        // 1. Verify the token with Google
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // 2. Check if user already exists in our DB
        let user = await User.findOne({ googleId });

        if (user) {
            // Optional: Update their details if they changed on Google
            user.name = name;
            user.picture = picture;
            await user.save();
        } else {
            // Create new user if they don't exist
            user = await User.create({
                googleId,
                email,
                name,
                picture,
            });
        }

        // 3. Generate our own JWT token for the frontend to use
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d', // User stays logged in for 30 days
        });

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture
            }
        });

    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(401).json({ success: false, message: "Invalid Token" });
    }
};

module.exports = { googleLogin };
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// --- THE FIX IS HERE ---
// We specify exactly who is allowed to talk to the backend
app.use(cors({
    origin: ["http://localhost:5173", "https://apna-ca-ch.vercel.app"], // Allow both Local and Vercel
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true // Crucial: allows cookies/headers to be sent
}));
// -----------------------

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Basic Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
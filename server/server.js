require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Required for middleware
const mongoose = require('mongoose');

// --- Database Connection ---
const connectDB = async () => {
    try {
        // The MONGO_URI from .env file is used here
        await mongoose.connect(process.env.MONGO_URI);
    
        console.log(`MongoDB connected to ${mongoose.connection.name}`);
    } catch (err) {
        console.error("Database Connection Error:", err.message);
        // Exit process with failure
        process.exit(1);
    }
};

const app = express();
connectDB();

// --- CORS Configuration (Fixes the Vercel/Render Cross-Origin Error) ---
// Define the allowed frontend origins
const allowedOrigins = [
    // 1. Add your Vercel URL (CRITICAL FIX)
    'https://manas-dost-lh3p.vercel.app', 
    // 2. Allow localhost for your development environment
    'http://localhost:3000', 
    'http://localhost:3001',
    // Add any other specific development ports or staging domains if needed
];

const corsOptions = {
  origin: (origin, callback) => {
    // Check if the origin of the request is in the allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // For security, block origins not in the list
      callback(new Error(`Not allowed by CORS policy: ${origin}`));
    }
  },
  credentials: true, // Allows cookies, authorization headers to be sent
};

// --- Middleware ---
// Apply the custom CORS middleware with the whitelist
app.use(cors(corsOptions));

// Built-in Express body-parser middleware for JSON data
app.use(express.json());

// A simple test route to ensure the server is alive.
app.get('/', (req, res) => {
    res.send('Manas Dost API is running...');
});

// --- Define API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/mood', require('./routes/mood'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/counselors', require('./routes/counselors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/journeys', require('./routes/journeys'));
app.use('/api/tools', require('./routes/tools'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/insights', require('./routes/insights'));
app.use('/api/journal', require('./routes/journal'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
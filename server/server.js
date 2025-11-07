require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express(); // <<< Moved app initialization up

// --- Database Connection ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected to ${mongoose.connection.name}`);
    } catch (err) {
        console.error("Database Connection Error:", err.message);
        process.exit(1);
    }
};

// --- CORS Configuration (Fixes the Vercel/Render Cross-Origin Error) ---
const allowedOrigins = [
    'https://manas-dost-lh3p-90lfhoc3k-kashish-khatods-projects.vercel.app', 
    'https://manas-dost-lh3p.vercel.app', 
    'http://localhost:3000', 
    'http://localhost:3001',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allows requests with no origin (like mobile apps or postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS policy: ${origin}`));
    }
  },
  credentials: true,
};

// --- CORS Fix for Preflight Requests ---
// <<< UPDATED >>> Explicitly enable CORS for all preflight OPTIONS requests.
// This is often needed when using whitelisting.
app.options('/', cors(corsOptions));

// --- Middleware ---
// Apply the custom CORS middleware
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

// <<< UPDATED >>> Start the server ONLY after the database is connected.
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
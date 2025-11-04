require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// --- Database Connection ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
        console.log(`MongoDB connected to ${mongoose.connection.name}`);
    } catch (err) {
        console.error("Database Connection Error:", err.message);
        // Exit process with failure
        process.exit(1);
    }
};

const app = express();
connectDB();

// --- Middleware ---
// This section must come before the API routes are defined.
app.use(cors());
app.use(express.json());

// A simple test route to ensure the server is alive.
app.get('/', (req, res) => {
    res.send('Manas Dost API is running...');
});

// --- Define API Routes ---
// Each route is now defined only once and in the correct order.
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
app.use('/api/journal', require('./routes/journal')); // This line ensures the journal route works


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Added fs module

dotenv.config();
connectDB();

const app = express();

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/counselors', require('./routes/counselors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/journeys', require('./routes/journeys'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/mood', require('./routes/mood'));
app.use('/api/journal', require('./routes/journal'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/insights', require('./routes/insights'));
app.use('/api/analytics', require('./routes/analytics'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
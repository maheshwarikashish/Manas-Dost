require('dotenv').config();
const mongoose = require('mongoose');
// MODIFIED: Correctly require the model file
const CollegeStudent = require('./models/CollegeStudent.js');

// A sample list of students with the new fields
const sampleStudents = [
    { name: "Priya Sharma", studentId: "SIH001", department: "Computer Science", year: 2 },
    { name: "Rahul Verma", studentId: "SIH002", department: "Mechanical Engineering", year: 3 },
    { name: "Anjali Gupta", studentId: "SIH003", department: "Electronics", year: 1 },
    { name: "Vikram Singh", studentId: "SIH004", department: "Civil Engineering", year: 4 },
    { name: "Sneha Reddy", studentId: "SIH005", department: "Computer Science", year: 2 },
];

const seedDatabase = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        // MODIFIED: Use the mongoose object to connect
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected for seeding...");

        // Clear the existing collection to avoid duplicates
        // MODIFIED: Use the CollegeStudent model to call deleteMany
        await CollegeStudent.deleteMany({});
        console.log("✅ Cleared the CollegeStudent collection.");

        // Insert the new sample students
        // MODIFIED: Use the CollegeStudent model to call insertMany
        await CollegeStudent.insertMany(sampleStudents);
        console.log("✅ Successfully seeded the CollegeStudent collection with 5 students.");

    } catch (err) {
        console.error("❌ Seeding error:", err.message);
    } finally {
        // MODIFIED: Use the mongoose object to disconnect
        await mongoose.disconnect();
        console.log("MongoDB Disconnected. Seeding process finished.");
    }
};

seedDatabase();

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Journey = require('../models/Journey'); // Import the new model
const geminiService = require('../services/geminiService');
const callGeminiAPI = geminiService.default.callGeminiAPI;

// The original predefined journeys, used for seeding new users
const predefinedJourneys = {
  anxiety: {
    journeyId: 'anxiety',
    title: '7-Day Challenge to Reduce Anxiety',
    description: 'Complete one small task each day to build healthy habits.',
    tasks: [
      { task: "Practice 2 minutes of mindful breathing.", completed: false },
      { task: "Write down three things you're grateful for.", completed: false },
      { task: "Go for a 15-minute walk without your phone.", completed: false },
      { task: "Listen to a calming music playlist.", completed: false },
      { task: "Write down any worries, then close the notebook.", completed: false },
      { task: "Reach out to a friend or family member.", completed: false },
      { task: "Reflect on your progress this week.", completed: false }
    ]
  },
  diet: {
    journeyId: 'diet',
    title: '7-Day Healthy Diet Challenge',
    description: 'Fuel your body and mind with nutritious choices.',
    tasks: [
        { task: "Drink 8 glasses of water today.", completed: false },
        { task: "Eat a piece of fruit with your breakfast.", completed: false },
        { task: "Avoid sugary drinks for the whole day.", completed: false },
        { task: "Include green vegetables in your dinner.", completed: false },
        { task: "Try a healthy new recipe.", completed: false },
        { task: "Avoid processed snacks for one day.", completed: false },
        { task: "Plan one healthy meal for tomorrow.", completed: false }
    ]
  },
  exercise: {
    journeyId: 'exercise',
    title: '7-Day Daily Exercise Challenge',
    description: 'Get your body moving to boost your mood and energy.',
    tasks: [
        { task: "Do a 10-minute stretching session.", completed: false },
        { task: "Go for a brisk 20-minute walk.", completed: false },
        { task: "Try a 15-minute home workout video.", completed: false },
        { task: "Take the stairs instead of the elevator all day.", completed: false },
        { task: "Do 20 squats and 10 push-ups.", completed: false },
        { task: "Play a sport or dance for 30 minutes.", completed: false },
        { task: "Go for a light jog or long walk.", completed: false }
    ]
  }
};

// Seed predefined journeys for a new user
const seedJourneysForUser = async (userId) => {
    try {
        const journeysToCreate = Object.values(predefinedJourneys).map(journey => ({
            ...journey,
            user: userId,
            isCustom: false,
        }));
        // Insert journeys but ignore if they already exist (due to unique index)
        await Journey.insertMany(journeysToCreate, { ordered: false });
    } catch (err) {
        // Ignore duplicate key errors (code 11000), which are expected on subsequent logins
        if (err.code !== 11000) {
            console.error("Error seeding journeys:", err);
        }
    }
};

// GET all journeys for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Check if the user has any journeys yet
        const count = await Journey.countDocuments({ user: userId });

        // If not, seed the predefined ones
        if (count === 0) {
            await seedJourneysForUser(userId);
        }

        // Fetch all journeys for the user
        const userJourneys = await Journey.find({ user: userId });

        // Convert the array to the object format the frontend expects
        const journeysMap = {};
        userJourneys.forEach(journey => {
            // Use the database _id for the key, which the frontend will need for updates
            journeysMap[journey._id] = journey;
        });

        res.json(journeysMap);
    } catch (err) {
        console.error('Error fetching journeys:', err.message);
        res.status(500).send('Server Error');
    }
});

// POST a new custom journey
router.post('/custom', auth, async (req, res) => {
    const { goal } = req.body;
    if (!goal) {
        return res.status(400).json({ msg: 'Goal is required' });
    }

    try {
        const prompt = `
            Act as an encouraging wellness coach. The user's goal is: "${goal}".
            Create a 7-day wellness plan with 7 simple, actionable tasks.
            List the 7 tasks clearly, one per line. Each line MUST start with "Day X: ".
            Do not include a title, description, or any other text. Just the 7 task lines.
        `;
        
        const aiResponseText = await callGeminiAPI(prompt);

        const tasks = aiResponseText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.match(/^Day \d+:/i));

        if (tasks.length < 7) {
            throw new Error(`AI returned an insufficient number of tasks. Expected 7, got ${tasks.length}.`);
        }

        const newJourneyData = {
            user: req.user.id,
            journeyId: `custom-${Date.now()}`, // Still useful for frontend logic
            title: `Your 7-Day Plan: ${goal}`,
            description: `A personalized plan generated by AI to help you achieve your goal: "${goal}"`,
            tasks: tasks.slice(0, 7).map(task => ({
                task: task.replace(/^Day \d+: /i, '').trim(),
                completed: false
            })),
            isCustom: true
        };

        const journey = new Journey(newJourneyData);
        await journey.save(); // Save the new journey to the database

        res.status(201).json(journey);

    } catch (err) {
        console.error("--- CUSTOM JOURNEY ERROR ---\n", err);
        res.status(500).send('Error generating or saving custom plan.');
    }
});

// PUT (update) a journey's progress by its database _id
router.put('/:id', auth, async (req, res) => {
    const { tasks } = req.body; // Expecting the full updated tasks array
    const journeyDbId = req.params.id;

    if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).json({ msg: 'Tasks array is required' });
    }

    try {
        // Find the journey by its unique database ID
        const journey = await Journey.findById(journeyDbId);

        if (!journey) {
            return res.status(404).json({ msg: 'Journey not found' });
        }

        // Ensure the journey belongs to the user making the request
        if (journey.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Update the tasks
        journey.tasks = tasks;
        await journey.save();
        
        res.status(200).json(journey); // Send back the updated journey
    } catch (err) {
        console.error('Error updating journey:', err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE a journey by its database _id
router.delete('/:id', auth, async (req, res) => {
    const journeyDbId = req.params.id;

    try {
        const journey = await Journey.findById(journeyDbId);

        if (!journey) {
            return res.status(404).json({ msg: 'Journey not found' });
        }

        // Ensure the journey belongs to the user making the request
        if (journey.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Correctly use findByIdAndDelete
        await Journey.findByIdAndDelete(journeyDbId);

        res.json({ msg: 'Journey removed' });
    } catch (err) {
        console.error('Error deleting journey:', err.message);
        // Handle cases where the ID format is incorrect
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Journey not found' });
        }
        res.status(500).send('Server Error');
    }
});


module.exports = router;

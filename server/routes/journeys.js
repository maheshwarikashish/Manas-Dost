const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const GeminiService = require('../services/geminiService');
const { callGeminiAPI } = GeminiService;

// In-memory data store for this example. Replace with a database in a real application.
const userJourneyProgress = {}; 

const predefinedJourneys = {
  anxiety: {
    id: 'anxiety',
    title: '7-Day Challenge to Reduce Anxiety',
    description: 'A 7-day plan with calming exercises and mindfulness techniques.',
    tasks: [
      { task: "Practice 2 minutes of mindful breathing." },
      { task: "Write down three things you're grateful for." },
      { task: "Go for a 15-minute walk without your phone." },
      { task: "Listen to a calming music playlist." },
      { task: "Write down any worries, then close the notebook." },
      { task: "Reach out to a friend or family member." },
      { task: "Reflect on your progress this week." }
    ]
  },
  diet: {
    id: 'diet',
    title: '7-Day Healthy Diet Challenge',
    description: 'A 7-day challenge to build better eating habits for your mind and body.',
    tasks: [
      { task: "Drink 8 glasses of water today." },
      { task: "Eat a piece of fruit with your breakfast." },
      { task: "Avoid sugary drinks for the whole day." },
      { task: "Include green vegetables in your dinner." },
      { task: "Try a healthy new recipe." },
      { task: "Avoid processed snacks for one day." },
      { task: "Plan one healthy meal for tomorrow." }
    ]
  },
  exercise: {
    id: 'exercise',
    title: '7-Day Daily Exercise Challenge',
    description: 'Get your body moving to boost your mood and energy.',
    tasks: [
      { task: "Do a 10-minute stretching session." },
      { task: "Go for a brisk 20-minute walk." },
      { task: "Try a 15-minute home workout video." },
      { task: "Take the stairs instead of the elevator all day." },
      { task: "Do 20 squats and 10 push-ups." },
      { task: "Play a sport or dance for 30 minutes." },
      { task: "Go for a light jog or long walk." }
    ]
  }
};

// GET all predefined journeys and user's progress
router.get('/', auth, (req, res) => {
    const userId = req.user.id;
    const journeysWithProgress = {};

    for (const key in predefinedJourneys) {
        const journey = predefinedJourneys[key];
        const progress = userJourneyProgress[userId]?.[journey.id] || [];
        journeysWithProgress[key] = {
            ...journey,
            tasks: journey.tasks.map((task, index) => ({
                ...task,
                completed: progress[index] || false
            }))
        };
    }
    res.json(journeysWithProgress);
});

// POST a new custom journey
router.post('/custom', auth, async (req, res) => {
    const { goal } = req.body;
    if (!goal) {
        return res.status(400).json({ msg: 'Goal is required' });
    }

    try {
        const prompt = `
            Act as an encouraging wellness coach for a college student. The student's goal is: "${goal}".
            Create a structured 7-day wellness plan. Your response MUST be formatted as a JSON object with "title", "description", and "tasks" properties. 
            The "tasks" property should be an array of 7 strings.
            Example:
            {
              "title": "My Awesome 7-Day Goal",
              "description": "A plan to achieve my goal.",
              "tasks": [
                "Day 1: Do the first thing.",
                "Day 2: Do the second thing.",
                "Day 3: Do the third thing.",
                "Day 4: Do the fourth thing.",
                "Day 5: Do the fifth thing.",
                "Day 6: Do the sixth thing.",
                "Day 7: Do the seventh thing."
              ]
            }
        `;
        
        let aiResponseText = await callGeminiAPI(prompt);
        
        // Sanitize the response: remove markdown backticks and trim
        aiResponseText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();

        const aiResponse = JSON.parse(aiResponseText);

        if (!aiResponse.title || !aiResponse.description || !Array.isArray(aiResponse.tasks) || aiResponse.tasks.length < 7) {
            throw new Error("AI returned an invalid format.");
        }

        const newJourney = {
            id: `custom-${Date.now()}`,
            title: aiResponse.title,
            description: aiResponse.description,
            tasks: aiResponse.tasks.map(task => ({ task: task.replace(/Day \d: /, '').trim(), completed: false }))
        };

        res.json(newJourney);

    } catch (err) {
        console.error("Error generating custom journey:", err);
        // More specific error logging
        if (err instanceof SyntaxError) {
            console.error("Failed to parse AI response as JSON.");
        }
        res.status(500).send('Error generating custom plan from AI. The AI may have returned an unexpected format.');
    }
});


// PUT to update journey progress
router.put('/:id', auth, async (req, res) => {
    const userId = req.user.id;
    const journeyId = req.params.id;
    const { tasks } = req.body; // Expecting an array of task objects with a 'completed' property

    if (!tasks) {
        return res.status(400).json({ msg: 'Tasks array is required' });
    }

    try {
        if (!userJourneyProgress[userId]) {
            userJourneyProgress[userId] = {};
        }
        // We only need to store the completion status
        const completedStatus = tasks.map(t => t.completed);
        userJourneyProgress[userId][journeyId] = completedStatus;

        console.log(`Journey progress for user ${userId} on journey ${journeyId} updated:`, completedStatus);
        res.json({ msg: 'Progress saved' });

    } catch (err) {
        console.error("Error saving journey progress:", err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

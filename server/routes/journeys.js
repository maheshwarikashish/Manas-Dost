const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const GeminiService = require('../services/geminiService');
const { callGeminiAPI } = GeminiService;

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

router.get('/', auth, (req, res) => {
    res.json(predefinedJourneys);
});

router.post('/custom', auth, async (req, res) => {
    const { goal } = req.body;
    if (!goal) {
        return res.status(400).json({ msg: 'Goal is required' });
    }

    try {
        const prompt = `
            Act as an encouraging wellness coach for a college student. The student's goal is: "${goal}".
            
            Create a structured 7-day wellness plan based on this goal. Your response MUST be formatted exactly as follows, with no extra text before or after:

            Title: [A creative and motivating title for the 7-day plan]
            Description: [A short, one-sentence description of the plan]
            Day 1: [A small, actionable task for the first day]
            Day 2: [A small, actionable task for the second day]
            Day 3: [A small, actionable task for the third day]
            Day 4: [A small, actionable task for the fourth day]
            Day 5: [A small, actionable task for the fifth day]
            Day 6: [A small, actionable task for the sixth day]
            Day 7: [A small, actionable task for the seventh day]
        `;
        
        const aiResponseText = await callGeminiAPI(prompt);

        const lines = aiResponseText.split('\n').filter(line => line.trim() !== '');
        const title = lines[0]?.replace('Title: ', '').trim();
        const description = lines[1]?.replace('Description: ', '').trim();
        const tasks = lines.slice(2).map(line => ({
            task: line.replace(/Day \d: /, '').trim()
        }));

        if (!title || !description || tasks.length < 7) {
            throw new Error("AI returned an invalid format.");
        }

        res.json({ id: `custom-${Date.now()}`, title, description, tasks });

    } catch (err) {
        console.error("Error generating custom journey:", err.message);
        res.status(500).send('Error generating custom plan from AI');
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        // This is a mock implementation. In a real application, you would save this to a database.
        console.log(`Journey progress for ${req.params.id} updated:`, req.body.tasks);
        res.json({ msg: 'Progress saved' });
    } catch (err) {
        console.error("Error saving journey progress:", err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
// This file contains all the mock data for the application,
// acting as a temporary database for development.

// Data for the Wellness Journeys feature
export const journeys = {
    anxiety: {
      title: '7-Day Challenge to Reduce Anxiety',
      description: 'Complete one small task each day to build healthy habits.',
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
      title: '7-Day Healthy Diet Challenge',
      description: 'Fuel your body and mind with nutritious choices.',
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
  
  // Data for the anonymous Peer Support forum
  export const communityPostsData = [
    { id: 1, author: "Anonymous Panda", content: "Is anyone else finding it hard to cope with the pressure of final year projects? Feeling really isolated.", tags: ["exam"], replies: [], reactions: {'❤️': 5, '👍': 12, '🤗': 3}, userReaction: null },
    { id: 2, author: "Anonymous Owl", content: "To the person who posted about project stress: you are not alone!", tags: ["exam"], replies: [{author: 'Anonymous User', content: 'Thank you for this!'}], reactions: {'❤️': 22, '👍': 8, '🤗': 15}, userReaction: null },
    { id: 3, author: "Anonymous Fox", content: "Just feeling really homesick this week. Any tips?", tags: ["first-year"], replies: [], reactions: {'❤️': 10, '👍': 2, '🤗': 6}, userReaction: null },
  ];
  
  // Data for the Resource Hub
  export const resources = {
      anxiety: [
          { title: '5-Minute Breathing Exercise', type: 'Article', content: 'Calm your mind with this simple breathing technique.'},
          { title: 'Understanding Anxiety', type: 'Article', content: 'Learn more about what anxiety is and how to manage it.'}
      ],
      meditation: [
          { title: '10-Minute Guided Meditation', type: 'Video', content: 'https://www.youtube.com/watch?v=O-6f5wQXSu8' },
          { title: 'Benefits of Daily Meditation', type: 'Article', content: 'Discover how meditation can improve your focus and well-being.'}
      ],
      motivation: [
          { title: 'Inspirational Student Stories', type: 'Video', content: 'https://www.youtube.com/watch?v=P_u_G_g_7vo' },
          { title: 'How to Stay Motivated', type: 'Article', content: 'Tips and tricks to help you stay focused on your goals.'}
      ]
  };
  
  // Data for the Booking a Session feature
  export const counselors = [
      { id: 1, name: 'Dr. Anjali Sharma', specialty: 'Anxiety & Stress' },
      { id: 2, name: 'Mr. Rohan Gupta', specialty: 'Academic Counseling' },
  ];
  
  export const availableTimes = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];
// Centralized mock data for the entire admin dashboard

export const adminCommunityPosts = [
    { id: 1, author: 'Anonymous Panda', content: "Is anyone else finding it hard to cope with the pressure of final year projects? Feeling really isolated.", timestamp: '2 hours ago', supports: 12, comments: 4 },
    { id: 2, author: 'Anonymous Owl', content: "To the person who posted about project stress: you are not alone!", timestamp: '1 hour ago', supports: 25, comments: 8 },
    { id: 3, author: 'Anonymous Fox', content: "Just feeling really homesick this week. Any tips?", timestamp: '30 minutes ago', supports: 5, comments: 1 },
];

export const adminResources = [
    { id: 1, title: '5 Tips for Managing Exam Stress', type: 'Article', content: 'Here is the full text of the article...' },
    { id: 2, title: 'Guided Meditation for Anxiety', type: 'Video', content: 'https://www.youtube.com/watch?v=O-6f5wQXSu8' },
];

export const adminCounselors = [
    { id: 1, name: 'Dr. Anjali Sharma', specialty: 'Anxiety & Stress Management', load: 85 },
    { id: 2, name: 'Mr. Rohan Gupta', specialty: 'Career & Academic Counseling', load: 60 },
];

export const baseIssuesData = {
    all: [75, 62, 45, 38, 30, 55],
    '1-eng': [85, 70, 30, 60, 80, 40],
    '1-arts': [60, 50, 50, 75, 90, 30],
    '4-eng': [95, 80, 50, 40, 20, 90],
    '4-biz': [70, 60, 60, 30, 15, 85],
};

export const MOCK_CHAT_LOGS = `User1: I'm so stressed about my finals. I can't sleep.\nUser2: The pressure from my parents is too much. I feel like I'm going to fail the semester.\nUser3: I miss home a lot. It's hard making friends.\nUser1: I just need some tips on how to manage my time better for exams.\nUser4: Is anyone else worried about getting a job after graduation? The competition is scary.`;
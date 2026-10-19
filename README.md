# Manas Dost — Student Mental Wellness Platform

A digital wellness companion designed to help college students build healthier habits, reflect on their emotions, and access mental-wellness support.

Manas Dost is a web application that brings together AI-assisted wellness conversations, mood tracking, journaling, student authentication, wellness resources, and counselor-related features in one platform.

The goal is to make everyday emotional well-being support more approachable and accessible for students.

##  Features

- **AI Wellness Companion:** Conversational support powered by Google's Gemini API, designed to provide empathetic responses and suggest positive coping strategies.
- **Student Authentication:** Student registration and login with password hashing and token-based authentication.
- **Mood Tracking:** Dedicated API routes for mood-related functionality.
- **Digital Journaling:** A dedicated journaling feature for personal reflection.
- **Counselor Support:** Counselor-related functionality and appointment management routes.
- **Wellness Resources:** A dedicated section for wellness-related resources.
- **Student Community:** Post-related functionality for student interaction.
- **Wellness Journeys:** Routes for structured wellness journeys.
- **Wellness Tools:** Dedicated API endpoints for wellness tools.
- **Insights and Analytics:** Separate endpoints for wellness insights and analytics.
- **Emergency Support:** A dedicated emergency-related API route.

*Feature availability and workflows may vary depending on the current implementation and deployment configuration.*

##  Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Routing | React Router |
| API communication | Axios |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| AI integration | Google Generative AI SDK |
| File uploads | Multer |
| Deployment configuration | Vercel configuration; frontend and backend deployment settings |

##  Architecture

Manas Dost follows a frontend-backend architecture.

```text
                  Student
                     |
                     v
          React Frontend (Vite)
                     |
              HTTP API Requests
                     |
                     v
          Node.js + Express API
             /           \
            v             v
      MongoDB          Gemini API
     (Mongoose)       (AI Chat)
            |
            v
     Persistent Data

```

### How it works

1. The student interacts with the React interface.
2. Axios sends HTTP requests to the backend API.
3. Express routes handle the relevant feature and validate incoming requests where implemented.
4. Mongoose communicates with MongoDB to retrieve or store application data.
5. Protected routes use authentication middleware to identify authenticated users.
6. The AI chat route sends the student's message to the Gemini service and returns the generated response.

##  Repository Structure

```text
Manas-Dost/
├── server/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   └── server.js
├── wellness-project/
│   ├── src/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── package.json
├── package-lock.json
├── vercel.json
└── README.md
```

##  Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB database
- A Google Gemini API key for AI chat functionality

### 1. Clone the repository

```bash
git clone https://github.com/maheshwarikashish/Manas-Dost.git
cd Manas-Dost
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory. Configure the variables using the names expected by the backend source code:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret
# Add the Gemini API key variable used by geminiService.
```

Never commit real API keys, database credentials, or JWT secrets to GitHub.

Start the backend:

```bash
npm start
```

The server uses port `5000` by default, or the port supplied by the deployment environment. The root API endpoint can be used to check whether the server is running.

### 3. Configure the frontend

Open another terminal:

```bash
cd wellness-project
npm install
npm run dev
```

Open the local URL printed by Vite.

**Important:** The frontend must be configured to send requests to the correct backend URL. Verify the API base URL and environment configuration before running the complete application locally.

##  Security Considerations

- Passwords are hashed using bcryptjs before being stored.
- JWTs are used for authentication.
- Protected endpoints use authentication middleware.
- Secrets and API keys should be stored in environment variables.
- AI-generated responses should be treated as wellness support, not as a substitute for professional mental-health care.

##  Future Improvements

- Add comprehensive automated tests for frontend and backend workflows.
- Improve validation, error handling, and API documentation.
- Add privacy controls and secure handling of sensitive wellness data.
- Improve accessibility and mobile responsiveness.
- Add clearer emergency-resource guidance and crisis escalation pathways.
- Improve monitoring and reliability of AI responses.
- Add documented deployment and configuration instructions.

##  Project

**Project:** Manas Dost  
**Repository:** [maheshwarikashish/Manas-Dost](https://github.com/maheshwarikashish/Manas-Dost)

Built to explore full-stack web development, AI integration, authentication, data persistence, and student-focused wellness experiences.

---

*Note: Manas Dost is a student wellness project, not a medical diagnostic or treatment system.*


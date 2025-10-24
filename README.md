# 🏋️‍♂️ FitTrack - MERN Fitness Tracker

**FitTrack** is a full-stack **MERN (MongoDB, Express, React, Node.js)** fitness tracking web application.  
It allows users to **log workouts, track progress, and manage nutrition goals** — all in one place.

---

## 🚀 Features

✅ User Authentication (JWT-based login & registration)  
✅ CRUD operations for workouts (Create, Read, Update, Delete)  
✅ Track calories, steps, and exercise stats  
✅ Responsive and modern UI built with React  
✅ MongoDB for secure data storage  
✅ Dark mode UI  
✅ Deployable using **Render (backend)** and optionally **Vercel (frontend)**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React, Axios, React Router, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT (JSON Web Tokens) |
| Deployment | Render / Vercel |

---

## 🧩 Folder Structure

FitTrack_MERN_PROJECT/
├── backend/ # Express + MongoDB backend
│ ├── controllers/ # Request logic
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API endpoints
│ ├── middleware/ # Authentication and error handling
│ ├── server.js # Entry point
│ └── package.json # Backend dependencies
│
├── frontend/ # React frontend
│ ├── src/ # Components, pages, hooks
│ ├── public/ # Static assets
│ └── package.json # Frontend dependencies
│
└── README.md # Project documentation

yaml
Copy code

---

## ⚙️ Installation and Setup (Local)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/tarun250/FitTrack_MERN_PROJECT.git
cd FitTrack_MERN_PROJECT
2️⃣ Setup Backend
bash
Copy code
cd backend
npm install
Create a .env file inside backend/ and add:

ini
Copy code
MONGO_URI=<Your MongoDB Atlas URI>
JWT_SECRET=<Your Secret Key>
PORT=5000
Start the backend:

bash
Copy code
npm run start
3️⃣ Setup Frontend
bash
Copy code
cd ../frontend
npm install
npm start
The app will open on http://localhost:3000

🌐 Deployment (Render)
You can host both backend + frontend on Render.

Steps:
Push the project to GitHub

Go to Render

Click New Web Service → Connect GitHub → Select Repo

In “Root Directory”, choose backend/

Add these commands:

Build Command

bash
Copy code
npm install
Start Command

bash
Copy code
npm start
Add environment variables:

ini
Copy code
MONGO_URI=<Your MongoDB Atlas URI>
JWT_SECRET=<Your Secret Key>
(Optional) Serve React from backend:
Add this inside backend/server.js (before app.listen()):

javascript
Copy code
const path = require("path");
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});
Deploy 🎉
Your live app will be accessible at:
https://fittrack-backend.onrender.com

📱 API Endpoints
Method	Endpoint	Description
POST	/api/users/register	Register new user
POST	/api/users/login	Login & get JWT
GET	/api/workouts	Get user workouts
POST	/api/workouts	Add workout
PUT	/api/workouts/:id	Update workout
DELETE	/api/workouts/:id	Delete workout

💡 Future Enhancements
Integrate fitness device APIs (Fitbit, Google Fit)

Add progress analytics and charts

Add social leaderboard for motivation

Make app PWA (installable on phones)

👨‍💻 Author
Tarun Gupta
📦 GitHub: @tarun250
💬 Project: FitTrack MERN Project



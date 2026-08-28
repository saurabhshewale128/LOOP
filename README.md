# LOOP – AI Customer Feedback Intelligence Platform

LOOP is an AI-powered customer feedback intelligence platform that helps businesses collect, organize, analyze, and understand customer feedback from multiple channels in one centralized system.

The platform uses AI to classify customer feedback, identify recurring themes, analyze sentiment, generate insights, answer questions about feedback, and produce Voice-of-Customer (VOC) reports.

---

## 🚀 Features

### 🔐 Authentication & Role-Based Access

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Admin, Analyst, and Viewer roles
- Protected API routes

### 🏢 Multi-Tenant Workspace

- Workspace-based data isolation
- Users belong to a workspace
- Feedback is associated with a workspace
- Users can only access feedback from their workspace
- Workspace-aware analytics and AI features

### 💬 Customer Feedback Management

- Add customer feedback
- View feedback
- Edit feedback
- Delete feedback based on role permissions
- Feedback search
- Multiple filters
- Sentiment, category, priority, status and theme information

### 📥 CSV Import

- Upload customer feedback through CSV
- Automatic AI analysis during import
- Sentiment classification
- Category classification
- Priority detection
- Theme detection
- Automatic summary generation

### 📤 CSV Export

- Export workspace feedback to CSV
- Includes customer information and AI-generated fields
- CSV export verified with 275 feedback records

### 📊 Analytics Dashboard

- Total feedback count
- Average rating
- Sentiment distribution
- Category analysis
- Theme frequency
- Trend analysis
- Detected spikes
- Action-oriented insights

### 🤖 AI Features

#### AI Insights
Generates intelligent insights from customer feedback.

#### AI Summary
Provides a summarized view of customer feedback.

#### Ask AI
Users can ask natural-language questions about customer feedback.

Example:

> What are the main customer complaints?

The AI response is generated using feedback data from the current workspace.

#### Voice of Customer Report

Generates an AI-powered VOC report containing:

- Executive Summary
- Sentiment Overview
- Top Issues
- Feature Requests
- Customer Strengths
- Recommended Actions

### 📄 VOC PDF Export

- Generates a downloadable PDF Voice-of-Customer report
- Includes AI-generated insights and recommendations

---

## 🛡️ Role Permissions

| Feature | Admin | Analyst | Viewer |
|---|---|---|---|
| View Feedback | ✅ | ✅ | ✅ |
| Add Feedback | ✅ | ✅ | ✅ |
| Edit Feedback | ✅ | ✅ | ❌ |
| Delete Feedback | ✅ | ❌ | ❌ |
| Analytics | ✅ | ✅ | ✅ |
| AI Features | ✅ | ✅ | ✅ |
| CSV Import | ✅ | ✅ | — |
| CSV Export | ✅ | ✅ | — |

---

## 🧠 AI Analysis

LOOP uses Google's Gemini AI services to analyze customer feedback.

Each feedback record can contain:

- Sentiment
- Category
- Priority
- Theme
- Summary

AI analysis is also used for:

- Ask AI
- AI Insights
- AI Summary
- VOC Reports

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Chart.js
- react-chartjs-2
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- csv-parse
- PDFKit
- Google Gemini API

---

## 📁 Project Structure

```text
LOOP/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── package.json
│   └── server.js
│
└── README.md
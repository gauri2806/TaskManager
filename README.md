# Voice-Enabled Task Tracker

A modern, AI-powered task management application that allows users to create, view, update, and delete tasks using both manual input and natural language voice commands. Built as an SDE assignment to demonstrate intelligent parsing of spoken tasks into structured data fields.

---

## Table of Contents
- [Project Setup](#project-setup)
- [Tech Stack](#tech-stack)
- [API Documentation](#api-documentation)
- [Decisions & Assumptions](#decisions--assumptions)
- [AI Tools Usage](#ai-tools-usage)
- [Demo Video](#demo-video)

---

## Project Setup

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Database**: MongoDB (local or Atlas)
- **AI/Voice API Key**: Google Speech-to-Text

### Installation Steps

#### 1. Clone the Repository
```zsh
git clone https://github.com/gauri2806/TaskManager.git
cd TaskManager
```

#### 2. Backend Setup
```zsh
cd Backend
npm install
```
- Configure your database connection in `config/db.js`.
- Create a `.env` file with required environment variables (PORT, DB_URI, OPENAI_API_KEY, etc).

#### 3. Frontend Setup
```zsh
cd ../task-tracker-frontend
npm install
```

#### 4. Running Locally
- **Backend**:  
  ```zsh
  cd Backend
  npm run server
  ```
- **Frontend**:  
  ```zsh
  cd task-tracker-frontend
  npm run dev
  ```
- The frontend will typically run on `http://localhost:5173` and backend on `http://localhost:8000` (configurable).

---

## Tech Stack
- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI/Voice**:  Google Speech-to-Text
- **Styling**: Material UI
- **Key Libraries**: axios, express, mongoose, dotenv

---

## API Documentation

### Task Endpoints

#### Create Task
- **POST** `/api/tasks`
- **Body**: `{ title, description, status, priority, dueDate }`
- **Success**: `201 Created` `{ task: {...} }`
- **Error**: `400 Bad Request` `{ error: "..." }`

#### Get All Tasks
- **GET** `/api/tasks`
- **Query**: `?status=In%20Progress&priority=High`
- **Success**: `200 OK` `{ tasks: [...] }`

#### Update Task
- **PUT** `/api/tasks/:id`
- **Body**: `{ ...fieldsToUpdate }`
- **Success**: `200 OK` `{ task: {...} }`

#### Delete Task
- **DELETE** `/api/tasks/:id`
- **Success**: `200 OK` `{ message: "Task deleted" }`

#### AI/Voice Parsing
- **POST** `/api/ai/parse-task`
- **Body**: `{ transcript: "..." }`
- **Success**: `{ title, dueDate, priority, status, transcript }`

---

## Decisions & Assumptions
- **Task Model**: Title, Description, Status, Priority, Due Date, (optional: createdAt, updatedAt)
- **Voice Parsing**: Uses third-party API for speech-to-text and custom logic for field extraction.
- **Status**: Defaults to "To Do" if not specified.
- **Priority**: Extracted from keywords; defaults to "Medium" if not found.
- **Limitations**: No authentication, single-user only

---

## AI Tools Usage
- **GitHub Copilot**: Used for code suggestions, boilerplate, and refactoring.
- **ChatGPT/Claude**: Used for brainstorming parsing logic, error handling, and documentation.
- **Voice Parsing**: Used Google Speech-to-Text for converting speech to text.
- **Learnings**: AI tools accelerated development, especially for parsing and edge-case handling. Prompts like "extract due date from natural language" were helpful.

---

## Demo Video
- [Demo Video Link](https://drive.google.com/file/d/1nY-pMdATL3AmfD-jRNXij0iPUrjIyQCs/view?usp=sharing)

---

## Additional Notes
- Known limitations: No authentication, no mobile app.
- Next steps: Add user accounts, notifications, mobile support, and more robust NLP for parsing.

---

## License
MIT

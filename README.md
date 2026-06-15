# Taskify - Real-Time Task Management System

Taskify is a production-quality, responsive full-stack task management web application. It is built using the **MERN (MongoDB, Express, React, Node.js)** stack with **Socket.IO** for live real-time state synchronization, and styled using a custom HSL-based palette on **Tailwind CSS v3**.

This project features a secure JWT-based authorization workflow, granular CRUD actions for task schedules, paginated lists, status/priority filtering, sorting, a dark/light mode toggle, and a detailed user activity logs tracker displayed in an analytics dashboard.

---

## Folder Structure

```text
Task Management System/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MongoDB database connection helper
│   │   ├── controllers/
│   │   │   ├── authController.js# Registration, login and profile business logic
│   │   │   └── taskController.js# CRUD, filtering, search, sorting and stats logic
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js# JWT verification protect middleware
│   │   │   └── errorMiddleware.js# Custom 404 and global JSON error formatter
│   │   ├── models/
│   │   │   ├── ActivityLog.js   # DB schema logging user actions
│   │   │   ├── Task.js          # DB schema for Task attributes
│   │   │   └── User.js          # DB schema for credentials and bcrypt hooks
│   │   ├── routes/
│   │   │   ├── authRoutes.js    # Routes mapping auth controllers
│   │   │   └── taskRoutes.js    # Routes mapping task controllers
│   │   ├── index.js             # Express app bootstrap & listeners setup
│   │   └── socket.js            # Socket.IO wrapper & users-room messaging
│   ├── .env.example             # Template file for environment configurations
│   ├── .env                     # Local environment configurations (ignored in git)
│   └── package.json             # Backend dependencies configuration
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   │   ├── StatCard.jsx     # Visual metric item widget
│   │   │   │   ├── TaskStats.jsx    # Metric grid and progress bar status
│   │   │   │   └── ActivityFeed.jsx # Action logging timeline list
│   │   │   ├── Layout/
│   │   │   │   ├── Navbar.jsx       # Header title & mobile sidebar control
│   │   │   │   └── Sidebar.jsx      # Navigation links and logout actions
│   │   │   ├── Tasks/
│   │   │   │   ├── TaskCard.jsx     # Visual cards representing individual tasks
│   │   │   │   ├── TaskFilters.jsx  # Search, filter, sorting controls line
│   │   │   │   └── TaskFormModal.jsx# Form overlay creating or editing tasks
│   │   │   └── UI/
│   │   │       ├── Button.jsx       # Custom button UI with loading spinners
│   │   │       ├── Input.jsx        # Custom input text box UI with errors
│   │   │       ├── Select.jsx       # Dropdown selectors UI
│   │   │       └── ThemeToggle.jsx  # Sun/Moon theme switcher button
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Authentication state store provider
│   │   │   ├── TaskContext.jsx  # Tasks state store and Socket connection hooks
│   │   │   ├── ThemeContext.jsx # Light/Dark mode state store provider
│   │   │   └── ToastContext.jsx # Dismissable notifications provider
│   │   ├── services/
│   │   │   └── api.js           # Central Axios interceptor Client
│   │   ├── App.jsx              # Master route router wrapper and page wrapper
│   │   ├── index.css            # Stylesheets, Google Fonts, and Tailwind setup
│   │   └── main.jsx             # React client bootstrap entry point
│   ├── index.html               # Main index.html mount page
│   ├── postcss.config.js        # PostCSS processors configuration
│   ├── tailwind.config.js       # Tailwind theme colors & dark configurations
│   ├── vite.config.js           # Vite server settings (port 3000)
│   └── package.json             # Frontend dependencies configuration
└── README.md                    # Main project documentation
```

---

## Technical Features

### 1. Authentication & Security
*   **Encrypted Storage**: Uses `bcryptjs` for hashing user passwords before storage.
*   **JWT Handshakes**: Issues high-entropy JSON Web Tokens containing user IDs during logins/registrations, expiring in 30 days.
*   **Protected Sub-routes**: Axios request interceptors inject standard `Bearer <token>` headers into requests, which is verified by auth middleware.
*   **Encapsulated Scope**: All MongoDB queries are scoped to the authenticated user ID (`req.user._id`), preventing data leaks.

### 2. Task Management & Operations (CRUD)
*   **Form Validations**: Client-side validation checks fields and limits title sizes before API transmission.
*   **Search**: Searches text case-insensitively in both title and description using regex expressions.
*   **Filtering**: Dynamically filters task categories based on their `status` and `priority`.
*   **Sorting**: Sorts task arrays by creation timestamps (`createdAt`), due dates (`dueDate`), or alphabetical titles (`title`).
*   **Pagination**: Tasks are paginated (6 per page) to optimize performance.

### 3. Dashboard & Analytical Feed
*   **Metrics Grid**: Displays total tasks, completed tasks, in-progress tasks, and pending tasks.
*   **Interactive Progress Bar**: Displays percentage completion index.
*   **Timeline Logs Feed**: Captures user activities (login, register, create/update/delete tasks) and displays them in a scrollable relative time feed.

### 4. Real-Time Socket.IO Synchronization
*   **Scoped Rooms**: Sockets join user-specific rooms (`user_${userId}`) on connection.
*   **Instant Updates**: Whenever a task is updated or deleted on one session, other connected browser tabs (for the same user) synchronize states automatically without requiring page reloads.

---

## Installation & Running Locally

### Prerequisites
*   Node.js (v18.0.0 or higher)
*   MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI

### Step 1: Clone and Environment Configs
1. Ensure files are in your local workspace.
2. In the `backend/` folder, confirm the `.env` file exists with the following parameters:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/taskmanager
   JWT_SECRET=super_secret_internship_task_management_project_key
   NODE_ENV=development
   ```

### Step 2: Running Backend Server
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run the backend in development hot-reload mode
npm run dev
# Server will run on http://localhost:5000
```

### Step 3: Running Frontend Client
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the frontend build server
npm run dev
# Application client will run on http://localhost:3000
```

---

## API Documentation

### Authentication Endpoints
*   `POST /api/auth/register` - Create user account. Returns profile info & JWT token.
*   `POST /api/auth/login` - Authenticate user credentials. Returns profile info & JWT token.
*   `GET /api/auth/me` - [Protected] Fetches current profile schema.

### Task Endpoints
*   `GET /api/tasks` - [Protected] Get paginated tasks. Queries: `page`, `status`, `priority`, `search`, `sortBy`, `sortOrder`.
*   `POST /api/tasks` - [Protected] Create a task. Payload: `title`, `description`, `status`, `priority`, `dueDate`.
*   `PUT /api/tasks/:id` - [Protected] Update task attributes.
*   `DELETE /api/tasks/:id` - [Protected] Delete a task.
*   `GET /api/tasks/dashboard` - [Protected] Fetches dashboard metrics, recent tasks, and activity logs.

---

## Deployment Guide

### Backend Deployment (Render)
1. Sign up on [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your Git repository.
4. Set details:
   *   **Name**: `taskify-api`
   *   **Root Directory**: `backend`
   *   **Runtime**: `Node`
   *   **Build Command**: `npm install`
   *   **Start Command**: `npm start`
5. Go to the **Environment** tab and add:
   *   `MONGODB_URI` (your MongoDB Atlas connection string)
   *   `JWT_SECRET` (secure key phrase)
   *   `NODE_ENV`: `production`
6. Click **Deploy Web Service**. Render will output a URL like `https://taskify-api.onrender.com`.

### Database Setup (MongoDB Atlas)
1. Set up a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Network Access** -> **Add IP Address** -> Select "Allow access from anywhere" (IP `0.0.0.0/0`) so Render servers can read/write.
3. Go to **Database Access** and create a user.
4. Click **Connect** -> **Drivers** and copy the URI. Replace `<password>` with the password you created.

### Frontend Deployment (Vercel)
1. Sign up on [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project**.
3. Import your Git repository.
4. In the configuration page, set:
   *   **Framework Preset**: `Vite`
   *   **Root Directory**: `frontend`
5. Expand **Environment Variables** and add:
   *   `VITE_API_URL` -> `https://taskify-api.onrender.com/api`
   *   `VITE_SOCKET_URL` -> `https://taskify-api.onrender.com`
6. Click **Deploy**. Vercel will output a live client URL.

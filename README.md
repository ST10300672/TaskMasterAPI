# TaskMaster API

## Overview
This is the backend REST API for the **TaskMaster** Android app. It handles CRUD operations for tasks, connects to a **MongoDB** database, and provides endpoints for task management.

---

## Features
- **Get all tasks**: `/tasks` (GET)
- **Get a single task**: `/tasks/:id` (GET)
- **Create a task**: `/tasks` (POST)
- **Update a task**: `/tasks/:id` (PUT)
- **Delete a task**: `/tasks/:id` (DELETE)

All endpoints accept and return JSON. Tasks are associated with users via `userId`.

---

## Setup

1. **Clone the repository**
```bash
git clone https://github.com/ST10300672/TaskMasterAPI.git
```

2. **Install dependencies**
```bash
npm install
```

3. **Create a `.env` file** in the root:
```
MONGO_URI=<your-mongodb-connection-string>
PORT=5000
```

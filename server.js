require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json()); // Parse JSON bodies

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        db = client.db('TaskMasterDB'); // Database name
        console.log('Connected to MongoDB!');
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
}

connectDB();

// --- Helper function to get tasks collection ---
const tasksCollection = () => db.collection('tasks');

// --- Root endpoint (test if API is running) ---
app.get('/', (req, res) => {
    res.send('TaskMaster API is running!');
});

// --- CRUD Endpoints ---

// Get all tasks (optionally for a specific user)
app.get('/tasks', async (req, res) => {
    try {
        const userId = req.query.userId; // ?userId=xxx
        const query = userId ? { userId } : {};
        const tasks = await tasksCollection().find(query).toArray();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single task by ID
app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await tasksCollection().findOne({ _id: new ObjectId(req.params.id) });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new task
app.post('/tasks', async (req, res) => {
    try {
        const { userId, title, description, completed } = req.body;
        if (!userId || !title) {
            return res.status(400).json({ message: 'userId and title are required' });
        }

        const task = { userId, title, description: description || '', completed: completed || false };
        const result = await tasksCollection().insertOne(task);
        res.status(201).json({ message: 'Task created', taskId: result.insertedId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a task by ID
app.put('/tasks/:id', async (req, res) => {
    try {
        const updates = req.body; // JSON body with fields to update
        const result = await tasksCollection().updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updates }
        );
        if (result.matchedCount === 0) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a task by ID
app.delete('/tasks/:id', async (req, res) => {
    try {
        const result = await tasksCollection().deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

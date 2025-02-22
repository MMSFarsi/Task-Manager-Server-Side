const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ptiwh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {serverApi: {version: ServerApiVersion.v1,strict: true,deprecationErrors: true,},
});

let tasksCollection;

async function connectDB() {
  try {
    // await client.connect();
    const db = client.db("taskdb");
    tasksCollection = db.collection("tasks");

    // console.log(" Successfully connected to MongoDB!");
  } catch (error) {
    // console.error(" MongoDB Connection Error:", error);
  }
}
connectDB();

// 🟢 Add Task
app.post("/tasks", async (req, res) => {
  try {
    const task = { ...req.body, timestamp: new Date() };
    const result = await tasksCollection.insertOne(task);
    res.status(201).json({ ...task, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await tasksCollection.find().toArray();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟡 Update Task
app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateResult = await tasksCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );
    res.json(updateResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete("/tasks/:id", async (req, res) => {
  try {
    await tasksCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/', (req, res) => {
  res.send('Server is working properly');
});

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

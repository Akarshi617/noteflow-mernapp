const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Note = require("./models/Note");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ✅ Home route (browser में visible text आएगा)
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ✅ Test API route
app.get("/api", (req, res) => {
  res.json({ message: "API working properly ✅" });
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

// ✅ Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
app.get("/api/notes", async (req, res) => {
    try {
      const notes = await Note.find();
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  // ✅ Create Note API
app.post("/api/notes", async (req, res) => {
    try {
      const { title, content } = req.body;
  
      const newNote = new Note({
        title,
        content
      });
  
      const savedNote = await newNote.save();
  
      res.status(201).json(savedNote);
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  // ✅ Delete Note API
app.delete("/api/notes/:id", async (req, res) => {
    try {
      const deletedNote = await Note.findByIdAndDelete(req.params.id);
  
      res.json({
        message: "Note deleted successfully ✅",
        deletedNote
      });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Note = require("./models/Note");

require("dotenv").config();

const app = express();


// ✅ CORS CONFIG (FIXED)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://noteflow-mernapp.vercel.app",
      "https://noteflow-mernapp-u1db.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// ✅ Middleware
app.use(express.json());


// ✅ Test Route
app.get("/", (req, res) => {
  res.send("🚀 Notes API Running");
});


// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err.message);
  });


// ================= ROUTES ================= //

// ✅ GET ALL NOTES
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// ✅ CREATE NOTE
app.post("/api/notes", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content required"
      });
    }

    const note = new Note({ title, content });
    const savedNote = await note.save();

    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// ✅ UPDATE NOTE
app.put("/api/notes/:id", async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});


// ✅ DELETE NOTE
app.delete("/api/notes/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    res.json({
      message: "Deleted Successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// ✅ PORT
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

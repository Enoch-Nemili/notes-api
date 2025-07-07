// 1. Load environment variables from .env (used locally; Render uses its env dashboard)
require('dotenv').config();

// 2. Import modules
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const Note = require('./models/note'); // ✅ Ensure this file exists and matches the filename

// 3. Create Express app
const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

// 4. Middleware to parse JSON
app.use(express.json());

// 5. Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// 6. Routes

// Home route
app.get('/', (req, res) => {
  res.send('📒 Welcome to Notes API (MongoDB Edition)');
});

// GET all notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "❌ Error fetching notes", error: err });
  }
});

// POST a new note
app.post('/notes', async (req, res) => {
  try {
    const { _id, title, content } = req.body;
    const newNote = new Note({ _id, title, content });
    await newNote.save();
    res.status(201).json({ message: "✅ Note added!", note: newNote });
  } catch (err) {
    res.status(400).json({ message: "❌ Could not add note", error: err.message });
  }
});

// PUT (update) a note
app.put('/notes/:id', async (req, res) => {
  try {
    const noteId = req.params.id;
    const updated = await Note.findByIdAndUpdate(noteId, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "❌ Note not found" });
    res.json({ message: `✏️ Note ${noteId} updated`, note: updated });
  } catch (err) {
    res.status(400).json({ message: "❌ Could not update note", error: err.message });
  }
});

// DELETE a note
app.delete('/notes/:id', async (req, res) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "❌ Note not found" });
    res.json({ message: `🗑️ Note ${req.params.id} deleted!` });
  } catch (err) {
    res.status(500).json({ message: "❌ Error deleting note", error: err.message });
  }
});

// Bulk insert notes (optional feature)
app.post('/notes/bulk', async (req, res) => {
  try {
    const insertedNotes = await Note.insertMany(req.body);
    res.status(201).json({ message: "✅ Multiple notes added!", notes: insertedNotes });
  } catch (err) {
    res.status(400).json({ message: "❌ Error adding multiple notes", error: err.message });
  }
});

// 7. Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

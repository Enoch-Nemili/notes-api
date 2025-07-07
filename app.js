// 1. Import modules
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Note = require('./models/note');

// 2. Create Express app
const app = express();
const port = 5000;

// 3. Middleware
app.use(express.json());

// 4. Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 5. Home Route
app.get('/', (req, res) => {
  res.send('📒 Welcome to Notes API (MongoDB Edition)');
});

// 6. GET /notes - Get all notes
app.get('/notes', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// 7. POST /notes - Add one note (custom _id optional)
app.post('/notes', async (req, res) => {
  try {
    const { _id, title, content } = req.body;
    const newNote = new Note({ _id, title, content });
    await newNote.save();
    res.status(201).json({
      message: "✅ Note added!",
      note: newNote
    });
  } catch (error) {
    res.status(400).json({ message: "❌ Failed to add note", error });
  }
});

// 8. PUT /notes/:id - Update a note
app.put('/notes/:id', async (req, res) => {
  const { title, content } = req.body;
  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    { title, content },
    { new: true }
  );

  if (!updatedNote) {
    return res.status(404).json({ message: "❌ Note not found!" });
  }

  res.json({
    message: "✏️ Note updated!",
    note: updatedNote
  });
});

// 9. DELETE /notes/:id - Delete a note
app.delete('/notes/:id', async (req, res) => {
  const deletedNote = await Note.findByIdAndDelete(req.params.id);

  if (!deletedNote) {
    return res.status(404).json({ message: "❌ Note not found!" });
  }

  res.json({ message: "🗑️ Note deleted!" });
});

// 🔟 POST /notes/bulk - Add multiple notes at once
app.post('/notes/bulk', async (req, res) => {
  try {
    const notes = req.body;
    const insertedNotes = await Note.insertMany(notes);
    res.status(201).json({
      message: "✅ Multiple notes added!",
      notes: insertedNotes
    });
  } catch (error) {
    res.status(400).json({ message: "❌ Error adding notes", error });
  }
});

// 11. Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

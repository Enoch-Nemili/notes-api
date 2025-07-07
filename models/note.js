// models/Note.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  _id: { type: String }, // ✅ allows custom IDs like "ronaldo"
  title: { type: String, required: true },
  content: { type: String, required: true }
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;

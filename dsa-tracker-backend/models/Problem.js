const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  status: {
    type: String,
    enum: ['Unsolved', 'Revise', 'Solved'],
    default: 'Unsolved'
  },
  link:{
    type: String,
    required: true,
  },
  notes:{
    type: String,
    default: "",
  },
  tags: [String],
  date: {
    type: Date,
    default: Date.now
  }
});



module.exports = mongoose.model('Problem', ProblemSchema);

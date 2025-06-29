const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');

// @route   GET /api/problems
router.get('/', async (req, res) => {
  const problems = await Problem.find();
  console.log(problems);
  res.json(problems);
});

// @route   POST /api/problems
router.post('/', async (req, res) => {
  const { title, topic, status, difficulty, tags } = req.body;
  const newProblem = new Problem({ title, topic, status, difficulty, tags });
  await newProblem.save();
  res.json(newProblem);
});
// DELETE a problem by ID
router.delete('/:id', async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json({ message: 'Problem deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;

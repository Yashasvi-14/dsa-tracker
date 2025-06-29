const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');

// @route   GET /api/problems
router.get('/', async (req, res) => {
  const problems = await Problem.find();
  res.json(problems);
});

// @route   POST /api/problems
router.post('/', async (req, res) => {
  const { title, status, tags } = req.body;
  const newProblem = new Problem({ title, status, tags });
  await newProblem.save();
  res.json(newProblem);
});

module.exports = router;

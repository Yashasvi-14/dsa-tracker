//initializes the Express application
const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const path = require("path");
const cors=require('cors');

const app=express();
dotenv.config();

const connectDB=require('./config/db');
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Serve frontend static files
app.use(express.static(path.join(__dirname, "frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});


// API routes
const problems = require('./routes/problems');
app.use('/api/problems', problems);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


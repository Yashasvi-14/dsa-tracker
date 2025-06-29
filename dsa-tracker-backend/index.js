//initializes the Express application
require('dotenv').config();
const express=require("express");
const connectDB=require('./config/db');
const app=express();

connectDB();
//let us send/receive JSON data
app.use(express.json());
//sets up a route for the homepage
app.use('/api/problems',require('./routes/problems'));
app.get("/",(req,res)=>{
    res.send("Welcome to the DSA Tracker backend!");
});
//Starts the server and listens on a port
const PORT=process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});


//initializes the Express application
const express=require("express");
const app=express();
//let us send/receive JSON data
app.use(express.json());
//sets up a route for the homepage
app.get("/",(req,res)=>{
    res.send("Welcome to the DSA Tracker backend!");
});
//Starts the server and listens on a port
const PORT=process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});

const mongoose=require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONG0_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("MongoDB connected");
}).catch(err=>{
    console.error("MongoDB connection error:",err);
});

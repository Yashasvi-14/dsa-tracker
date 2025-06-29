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
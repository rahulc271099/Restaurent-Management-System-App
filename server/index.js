const express = require('express')
const connectDB = require('./src/config/db')
require('dotenv').config()
const app = express()
const cors = require("cors")
const cookieParser = require('cookie-parser');
const apiRouter = require('./src/routes')


// origin: "http://localhost:5174",
app.use(
    cors({
      origin: ["http://localhost:5173", "https://restaurent-management-system-app.vercel.app"],
      credentials: true,
    })
  );


app.use(cookieParser());
app.use(express.json())



app.get('/',(req,res)=>{
    res.send("Server is running")
})


connectDB()

app.use('/api', apiRouter)

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);  
})
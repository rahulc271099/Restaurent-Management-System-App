const express = require('express')
const connectDB = require('./src/config/db')
const apiRouter = require('./src/routes')
require('dotenv').config()
const cookieParser = require('cookie-parser');
const app = express()


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
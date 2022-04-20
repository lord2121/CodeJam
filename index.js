const express = require("express")
const ejs = require("ejs")
const PORT = 3000
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const productRoutes = require('./routes/productRoutes.js')



const app = express()
app.engine('ejs' , ejsMate);
app.set("view engine" , "ejs")
app.use(express.static("public"))


app.get("/",(req,res)=>{
    res.render("index")
})

app.use('/product' , productRoutes);


app.use('*' , (req , res) => {
    res.send("404 not found")
})

app.listen(PORT, ()=>{
    console.log("Listening on PORT 3000")
})
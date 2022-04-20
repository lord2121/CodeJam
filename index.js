const express = require("express")
const ejs = require("ejs")
const PORT = 3000
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")



const app = express()
app.engine('ejs' , ejsMate);
app.set("view engine" , "ejs")
app.use(express.static("public"))


app.get("/",(req,res)=>{
    res.render("index")
})




app.listen(PORT, ()=>{
    console.log("Listening on PORT 3000")
})
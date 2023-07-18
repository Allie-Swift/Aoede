const express = require("express")
const {initialize} = require("../Service/DataProvider");
const server = express.Router()

server.all("/init",(req,res)=>{
    initialize()
})

module.exports = server
const express = require("express")
const {getAlbum, getArtist} = require("../Service/DataProvider");
const server = express.Router()

server.get("/albums",(req,res)=>{
    const albums = getAlbum()
    res.send(albums)
})
server.get("/artists",(req,res)=>{
    const artists = getArtist()
    res.send(artists)
})


module.exports = server
const express = require("express")
const {getAlbum, getArtist, getAlbumCover} = require("../Service/DataProvider");
const server = express.Router()

server.get("/albums",(req,res)=>{
    const albums = getAlbum()
    res.send(albums)
})
server.get("/artists",(req,res)=>{
    const artists = getArtist()
    res.send(artists)
})

server.get("/albumCover/:albumName",(req,res)=>{
    const albumCover = getAlbumCover( req.params.albumName)
    res.setHeader("Content-Type",albumCover.mime)
    res.send(Buffer.from(albumCover.imageBuffer))
})


module.exports = server
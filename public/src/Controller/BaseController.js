const express = require("express")
const {loadMusicLibrary} = require("../Service/DataProvider");
const {getConfig} = require("../Service/FileManager");
const server = express.Router()

server.all("/init", (req, res) => {
    // initialize()
    const musicLibraryPath = getConfig("MusicLibrary")
    if (musicLibraryPath) {
        loadMusicLibrary(musicLibraryPath)
            .then(() => res.send())
            .catch(() => res.status(500).send())
    } else {
        res.send()
    }
})

server.all("/")

module.exports = server
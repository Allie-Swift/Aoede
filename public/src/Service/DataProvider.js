const Database = require("../Database")
const Artist = require("../Model/Artist");
const Album = require("../Model/Album");
const Song = require("../Model/Song");

const db = new Database()

const initialize = ()=>{
    db.register(Artist)
    db.register(Album)
    db.register(Song)
    db.sync(true)
}

module.exports = {
    initialize
}


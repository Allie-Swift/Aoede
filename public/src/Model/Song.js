const {DataType} = require("../Database");

class Song {

    file_path
    name
    album
    artists
    disc
    track

    _file_path = {type: DataType.TEXT, primaryKey: true}
    _name = {type: DataType.TEXT}
    _album = {type: DataType.OBJECT, target: "Album", via: "name"}
    _artists = {type: DataType.LIST, target: "Artist", via: "name", pk: "file_path"}
    _disc = {type: DataType.NUMBER}
    _track = {type: DataType.NUMBER}

    constructor(file_path, name, album, artists, disc, track) {
        this.file_path = file_path
        this.name = name
        this.album = album
        this.artists = artists
        this.disc = disc
        this.track = track
    }

}

module.exports = Song
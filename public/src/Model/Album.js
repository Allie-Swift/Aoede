const {DataType} = require("../Database");

class Album {

    name
    release_year
    image_file_path
    artists

    _name = { type: DataType.TEXT, primaryKey: true }
    _release_year = { type: DataType.NUMBER }
    _image_file_path = { type: DataType.TEXT }
    _artists = { type: DataType.LIST, target: "Artist", via: "name", pk: "name" }

    constructor(name, release_year, image_file_path, artists) {
        this.name = name
        this.release_year = release_year
        this.image_file_path = image_file_path
        this.artists = artists
    }
}

module.exports = Album
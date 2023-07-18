class Song {

    file_path
    name
    album
    artists

    _file_path = { type: DataType.TEXT, primaryKey: true }
    _name = { type: DataType.TEXT }
    _album = { type: DataType.OBJECT, target: "Album", via: "name" }
    _artists = { type: DataType.LIST, target: "Artist", via: "name", pk: "file_path" }

    constructor(file_path, name, album, artists) {
        this.file_path = file_path
        this.name = name
        this.album = album
        this.artists = artists
    }

}

module.exports = Song
const {Database} = require("../Database")
const Artist = require("../Model/Artist");
const Album = require("../Model/Album");
const Song = require("../Model/Song");
const fs = require("fs");
const path = require("path");
const NodeID3 = require('node-id3')

const db = new Database()

const initialize = () => {
    db.register(Artist)
    db.register(Album)
    db.register(Song)
    db.sync()
}

initialize()

const loadMusicLibrary = async (folderPath) => {
    const songList = []
    // Create a promise wrapper around the scanMusicFolders function
    await scanMusicFolders(folderPath, (metadata) => {
        const albumArtists = metadata.albumArtist.split("/").map((name) => new Artist(name, ""));
        const songArtists = metadata.artist.split("/").map((name) => new Artist(name, ""));
        let album = new Album(metadata.album, metadata.year, "", albumArtists);
        let song = new Song(metadata.filePath, metadata.title, album, songArtists, metadata.disc, metadata.track);
        songList.push(song);
    })

    await db.upsert(songList)
}

const scanMusicFolders = async (folderPath, processMetadata) => {
    try {
        const files = await new Promise((resolve, reject) => {
            fs.readdir(folderPath, (err, files) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(files)
                }
            })
        })
        const promises = files.map(async (file) => {
            const filePath = path.join(folderPath, file)
            const stats = await new Promise((resolve, reject) => {
                fs.stat(filePath, (error, stats) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(stats)
                    }
                })
            })
            if (stats.isDirectory()) {
                return scanMusicFolders(filePath, processMetadata) // Recursively call function for subdirectories
            } else if (path.extname(file).toLowerCase() === '.mp3') {
                return readMP3Metadata(filePath, processMetadata) // Parse metadata for .mp3 files
            }
        })
        await Promise.all(promises)
    } catch (error) {

    }
}

const readMP3Metadata = (filePath, onReadMetadata) => {
    const tags = NodeID3.read(filePath)
    onReadMetadata({
        filePath: filePath,
        album: tags.album,
        artist: tags.artist,
        disc: tags.partOfSet,
        title: tags.title,
        track: tags.trackNumber,
        albumArtist: tags.performerInfo,
        year: tags.year,
        image: tags.image
    })
}

const getArtist = ()=>{
    return db.get("Artist")
}

const getAlbum = ()=>{
    return db.get("Album")
}

module.exports = {
    initialize,
    loadMusicLibrary,
    getArtist,
    getAlbum

}


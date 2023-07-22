const {DataType} = require("../Database");

class Artist {

    name
    image_file_path

    _name = { type: DataType.TEXT, primaryKey: true }
    _image_file_path = { type: DataType.TEXT }

    constructor(name, image_file_path) {
        this.name = name
        this.image_file_path = image_file_path
    }
}

module.exports = Artist
const {app} = require("electron")
const path = require("path");
const fs = require("fs");

const ROOT_PATH = path.join(app.getPath("music"), "Aoede")
if (!fs.existsSync(ROOT_PATH)) fs.mkdirSync(ROOT_PATH)
const CONFIG_FILE_PATH = path.join(ROOT_PATH, "app.config")

// Function to update or insert a configuration key-value pair in the app.config file
const fsUpsertConfig = (key, value) => {
    let jsonData = {}

    try {
        delete require.cache[require.resolve(CONFIG_FILE_PATH)]
        jsonData = require(CONFIG_FILE_PATH)
    } catch (error) {
        // TODO
    }

    jsonData[key] = value
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(jsonData, null, 2))
}

// Function to retrieve a configuration value based on the given key from the app.config file
const fsGetConfig = (key) => {
    try {
        delete require.cache[require.resolve(CONFIG_FILE_PATH)]
        let jsonData = require(CONFIG_FILE_PATH)
        return jsonData[key]
    } catch (error) {
        return
    }
}

module.exports = {
    fsUpsertConfig,
    fsGetConfig
}
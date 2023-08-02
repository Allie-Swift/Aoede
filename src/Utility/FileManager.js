import {app} from "@electron/remote";

const path = window.require("path");
const fs = window.require("fs");

const ROOT_PATH = path.join(app.getPath("music"), "Aoede")
if (!fs.existsSync(ROOT_PATH)) fs.mkdirSync(ROOT_PATH)
const CONFIG_FILE_PATH = path.join(ROOT_PATH, "app.config")

// Function to update or insert a configuration key-value pair in the app.config file
export function upsertConfig(key, value) {
    let jsonData
    console.log(fs.readFileSync(CONFIG_FILE_PATH).toString())
    if (fs.existsSync(CONFIG_FILE_PATH)) {
        jsonData = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH).toString())
    } else {
        jsonData = {
            ServerAddress: "",
            MusicLibrary: "",
            SyncRequired: true
        }
    }
    jsonData[key] = value
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(jsonData, null, 2))
}

// Function to retrieve a configuration value based on the given key from the app.config file
export function getConfig(key) {
    try {
        return JSON.parse(fs.readFileSync(CONFIG_FILE_PATH).toString())[key]
    } catch {
        return undefined
    }
}
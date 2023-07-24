const {app, BrowserWindow} = require('electron')
const isDev = require('electron-is-dev')
const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")
const ip = require("ip");
const {upsertConfig} = require("./src/Service/FileManager");
require('@electron/remote/main').initialize()

function createWindow() {

    const server = express()
    server.use(cors())
    server.use(bodyParser.json())
    server.use("/", require("./src/Controller/BaseController"))
    const host = server.listen(1010, () => {
        upsertConfig("ServerAddress", `http://${ip.address()}:${host.address().port}/`)
    })

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })
    require('@electron/remote/main').enable(win.webContents)
    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    )
    if (isDev) win.webContents.openDevTools({mode: 'detach'})
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
})

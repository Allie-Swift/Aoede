const {app, BrowserWindow, ipcMain} = require('electron')
const isDev = require('electron-is-dev')
const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")
const ip = require("ip");
const {upsertConfig, getConfig} = require("./src/Service/FileManager");
require('@electron/remote/main').initialize()

function createWindow() {

    const server = express()
    server.use(cors())
    server.use(bodyParser.json())
    server.use("/", require("./src/Controller/BaseController"))
    server.use("/api",require("./src/Controller/DataController"))
    const host = server.listen(1010, () => {
        upsertConfig("ServerAddress", `http://${ip.address()}:${host.address().port}/`)
    })

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        // autoHideMenuBar: true,
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
    win.webContents.on('did-finish-load', () => {
        win.webContents.send("ServerAddress", getConfig("ServerAddress"))
    })
}

app.whenReady().then(()=>{
    createWindow()
    ipcMain.handle("ServerAddress", ()=>getConfig("ServerAddress"))
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
})

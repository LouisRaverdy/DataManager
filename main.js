const { app, BrowserWindow, autoUpdater, dialog } = require('electron')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 300,
        height: 300,
        resizable: false,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('html/launchScreen.html')

    const server = 'https://github.com/LouisRaverdy/DataManager'
    const url = `${server}/update/${process.platform}/${app.getVersion()}`

    autoUpdater.setFeedURL({ url })
    autoUpdater.checkForUpdates()

    setTimeout(function() {
        win.close()
        const MainWin = new BrowserWindow({
            width: 700,
            height: 500,
            resizable: true,
            frame: false,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
        MainWin.loadFile('html/index.html')
    }, 4000)
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
        type: 'info',
        buttons: ['Redémarer', 'Plus tard'],
        title: 'Mise à jour disponible',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: "Une nouvelle version a été téléchargée. Redemarez l'application pour installer la mise à jour.."
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
})
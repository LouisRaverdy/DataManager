const electron = require('electron')
const { autoUpdater } = require('electron-updater')
const ipc = require("electron").ipcMain;


import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBG_FrDlEs7zr6sPWbFykDn5W41Q2q9qdQ",
    authDomain: "datamanaager-c0b75.firebaseapp.com",
    projectId: "datamanaager-c0b75",
    storageBucket: "datamanaager-c0b75.appspot.com",
    messagingSenderId: "848151418499",
    appId: "1:848151418499:web:1f9053003885076207adb6",
    measurementId: "G-J0M98GP97S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

const ElectronApp = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

function sendStatusToWindow(text) {
    if (mainWindow) {
        mainWindow.webContents.send('message', text);
    }
}

ipc.on("toggle-maximize-window", function(event) {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});

ipc.on("close-window", function(event) {
    mainWindow.close();
});

ipc.on("minimize-window", function(event) {
    mainWindow.minimize();
});

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 300,
        height: 300,
        resizable: true,
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    mainWindow.loadFile('html/launchScreen.html')
    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.show();
        autoUpdater.checkForUpdates()
    });
}

ElectronApp.whenReady().then(() => {
    createWindow()

    ElectronApp.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

ElectronApp.on('window-all-closed', () => {
    if (process.platform !== 'darwin') ElectronApp.quit()
});

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Vérification des mises à jour ...');
});
autoUpdater.on('update-available', info => {
    sendStatusToWindow('Mise à jour disponible !');
});
autoUpdater.on('update-not-available', info => {
    sendStatusToWindow('Pas de nouvelles mises à jour. Lancement.');
    setTimeout(function() {
        mainWindow.close()
        var user = firebase.auth().currentUser;

        if (user) {
            mainWindow = new BrowserWindow({
                width: 1050,
                height: 750,
                resizable: true,
                frame: false,
                show: false,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false,
                }
            })
            mainWindow.loadFile('html/index.html')
            mainWindow.webContents.on('did-finish-load', function() {
                mainWindow.show();
            });
        } else {
            mainWindow = new BrowserWindow({
                width: 1050,
                height: 750,
                resizable: true,
                frame: false,
                show: false,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false,
                }
            })
            mainWindow.loadFile('html/login.html')
            mainWindow.webContents.on('did-finish-load', function() {
                mainWindow.show();
            });
        }
    }, 2000)
});
autoUpdater.on('error', err => {
    sendStatusToWindow(`Erreur : ${err.toString()}`);
});
autoUpdater.on('download-progress', progressObj => {
    sendStatusToWindow(
        `Mise à jour disponible - ${progressObj.percent}% (${progressObj.transferred} + '/' + ${progressObj.total})`
    );
});

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    autoUpdater.quitAndInstall()
})


// LOGIN FUNCTIONS

ipc.on('Signin', (event, args) => {
    data = JSON.parse(args.parase)

    createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
            const user = userCredential.user;

            responseData = { success: true, errCode: "", errMessage: "" }
            event.returnValue = responseData;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            responseData = { success: true, errCode: errorCode, errMessage: errorMessage }
            event.returnValue = responseData;
        });
});


ipc.on('Login', (event, args) => {
    data = JSON.parse(args.parase)

    signInWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
            const user = userCredential.user;

            responseData = { success: true, errCode: "", errMessage: "" }
            event.returnValue = responseData;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            responseData = { success: true, errCode: errorCode, errMessage: errorMessage }
            event.returnValue = responseData;
        });
});
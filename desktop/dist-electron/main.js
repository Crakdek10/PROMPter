"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 1100,
        height: 750,
        frame: false, // <--- 1. Quita el marco nativo de Windows
        backgroundColor: '#1a0f0f', // <--- 2. Fondo oscuro inicial (coincide con tu tema)
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    const isDev = !electron_1.app.isPackaged;
    if (isDev) {
        win.loadURL("http://localhost:4200");
        win.webContents.openDevTools({ mode: "detach" });
    }
    else {
        // Esta ruta ya estaba correcta en tu versión anterior, la mantengo
        win.loadFile(path.join(__dirname, "..", "dist", "prompter", "browser", "index.html"));
    }
    // --- 3. Lógica para los controles de ventana (Minimizar/Maximizar/Cerrar) ---
    electron_1.ipcMain.on('window-controls', (event, action) => {
        // Verificamos que la orden venga de esta ventana
        const webContents = event.sender;
        const senderWindow = electron_1.BrowserWindow.fromWebContents(webContents);
        if (senderWindow !== win)
            return;
        switch (action) {
            case 'minimize':
                win.minimize();
                break;
            case 'maximize':
                if (win.isMaximized()) {
                    win.unmaximize();
                }
                else {
                    win.maximize();
                }
                break;
            case 'close':
                win.close();
                break;
        }
    });
}
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});

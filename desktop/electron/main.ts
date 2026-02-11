import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";

function createWindow() {
  const win = new BrowserWindow({
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

  const isDev = !app.isPackaged;

  if (isDev) {
    win.loadURL("http://localhost:4200");
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    // Esta ruta ya estaba correcta en tu versión anterior, la mantengo
    win.loadFile(path.join(__dirname, "..", "dist", "prompter", "browser", "index.html"));
  }

  // --- 3. Lógica para los controles de ventana (Minimizar/Maximizar/Cerrar) ---
  ipcMain.on('window-controls', (event, action) => {
    // Verificamos que la orden venga de esta ventana
    const webContents = event.sender;
    const senderWindow = BrowserWindow.fromWebContents(webContents);
    if (senderWindow !== win) return;

    switch (action) {
      case 'minimize':
        win.minimize();
        break;
      case 'maximize':
        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
        break;
      case 'close':
        win.close();
        break;
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

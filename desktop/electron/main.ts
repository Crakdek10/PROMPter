import { app, BrowserWindow, ipcMain, desktopCapturer } from "electron";
import * as path from "path";

// IPC: listar fuentes capturables (ventanas/pantallas)
ipcMain.handle("systemAudioSources:list", async () => {
  const sources = await desktopCapturer.getSources({
    types: ["window", "screen"],
    fetchWindowIcons: false,
  });

  return sources.map((s) => ({ id: s.id, name: s.name }));
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 750,
    frame: false,
    backgroundColor: "#1a0f0f",
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
    win.loadFile(path.join(__dirname, "..", "dist", "prompter", "browser", "index.html"));
  }

  ipcMain.on("window-controls", (event, action) => {
    const senderWindow = BrowserWindow.fromWebContents(event.sender);
    if (senderWindow !== win) return;

    if (action === "minimize") win.minimize();
    if (action === "maximize") win.isMaximized() ? win.unmaximize() : win.maximize();
    if (action === "close") win.close();
  });

  ipcMain.on("window-opacity", (_event, value01: number) => {
    const v = Number(value01);
    if (!Number.isFinite(v)) return;

    // ejemplo: limitar entre 0.3 y 1
    const clamped = Math.max(0.3, Math.min(1, v));
    win.setOpacity(clamped);
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

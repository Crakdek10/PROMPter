import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("prompter", {
  ping: () => "pong",
  minimize: () => ipcRenderer.send('window-controls', 'minimize'),
  maximize: () => ipcRenderer.send('window-controls', 'maximize'),
  close: () => ipcRenderer.send('window-controls', 'close'),
});

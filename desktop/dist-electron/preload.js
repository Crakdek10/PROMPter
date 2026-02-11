"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("prompter", {
    ping: () => "pong",
    minimize: () => electron_1.ipcRenderer.send('window-controls', 'minimize'),
    maximize: () => electron_1.ipcRenderer.send('window-controls', 'maximize'),
    close: () => electron_1.ipcRenderer.send('window-controls', 'close'),
});

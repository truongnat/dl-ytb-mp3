import { BrowserWindow, ipcMain } from "electron";
import { themeShouldUseDarkColors } from "./theme-should-use-dark-colors";
import { onSelectPathFolder } from "./on-select-folder-path";

export const registerIpcEventListeners = (mainWindow: BrowserWindow) => {
    ipcMain.on("themeShouldUseDarkColors", themeShouldUseDarkColors);
    ipcMain.handle("onSelectPathFolder", onSelectPathFolder(mainWindow));
};
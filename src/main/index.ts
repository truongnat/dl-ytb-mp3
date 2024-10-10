import { BrowserWindow, app } from "electron";
import { createBrowserWindow } from "./create-browser-window";
import { loadFileOrUrl } from "./load-file-or-url";
import { registerIpcEventListeners } from "./events";
import { registerNativeThemeEventListeners } from "./events/theme-listeners";

(async () => {
    await app.whenReady();
    const mainWindow = createBrowserWindow();
    loadFileOrUrl(mainWindow);
    registerIpcEventListeners(mainWindow);
    registerNativeThemeEventListeners(BrowserWindow.getAllWindows());
})();

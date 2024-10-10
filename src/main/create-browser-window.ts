import { BrowserWindow } from "electron";
import { join } from "path";

export const createBrowserWindow = (): BrowserWindow => {
    const preloadScriptFilePath = join(__dirname, "..", "dist-preload", "index.js");

    return new BrowserWindow({
        autoHideMenuBar: true,
        backgroundMaterial: "mica",
        vibrancy: "header",
        webPreferences: {
            preload: preloadScriptFilePath,
        },
        icon: join(__dirname, "..", "build", "app-icon-dark.png"),
    });
};
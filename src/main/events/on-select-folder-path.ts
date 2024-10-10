import { BrowserWindow, dialog } from "electron";

export const onSelectPathFolder = (mainWindow: BrowserWindow) => async () => {
    return dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    }).then(result => result.filePaths[0]).catch(err => null)
}
import { IpcMainEvent, nativeTheme } from "electron";

export const themeShouldUseDarkColors = (event: IpcMainEvent) => {
    event.returnValue = nativeTheme.shouldUseDarkColors;
}
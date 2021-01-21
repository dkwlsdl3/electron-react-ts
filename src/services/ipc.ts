import { ipcRenderer } from 'electron';

export const closeCurrentWindow = (): void => {
    ipcRenderer.invoke('window-close');
};
export const minimizeCurrentWindow = (): void => {
    ipcRenderer.invoke('window-minimize');
};
export const maximizeCurrentWindow = (): void => {
    ipcRenderer.invoke('window-maximize');
};
export const unmaximizeCurrentWindow = (): void => {
    ipcRenderer.invoke('window-unmaximize');
};

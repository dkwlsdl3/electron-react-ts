import { remote } from 'electron';
import fs from 'fs';
const { dialog } = remote;

export const closeCurrentWindow = (): void => {
    remote.getCurrentWindow().close();
};

export const minimizeCurrentWindow = (): void => {
    remote.getCurrentWindow().minimize();
};

export const maximizeCurrentWindow = (): void => {
    remote.getCurrentWindow().maximize();
};

export const unmaximizeCurrentWindow = (): void => {
    remote.getCurrentWindow().unmaximize();
};

export const saveCSVFile = (fileName: string, data: string): void => {
    const options = {
        defaultPath: fileName,
        filters: [
            { name: 'CSV Files', extensions: ['csv'] },
            { name: 'All Files', extensions: ['*'] },
        ],
    };
    dialog.showSaveDialog(remote.getCurrentWindow(), options).then((v) => {
        if (v.filePath === undefined) {
            console.log("You didn't save the file");
            return;
        }

        if (v.canceled) {
            console.log('canceled');
            return;
        }

        fs.writeFile(v.filePath, data, (err) => {
            if (err) {
                dialog.showMessageBox(remote.getCurrentWindow(), {
                    type: 'error',
                    message: 'An error ocurred creating the file ' + err.message,
                });
            }
            dialog.showMessageBox(remote.getCurrentWindow(), { type: 'info', message: '파일이 저장 되었습니다.' });
        });
    });
};

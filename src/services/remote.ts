import { remote } from 'electron';
import fs from 'fs';
import * as Excel from 'exceljs';
import { saveAs } from 'file-saver';
const { dialog } = remote;

export function closeCurrentWindow() {
    remote.getCurrentWindow().close();
}

export function minimizeCurrentWindow() {
    remote.getCurrentWindow().minimize();
}

export function maximizeCurrentWindow() {
    remote.getCurrentWindow().maximize();
}

export function unmaximizeCurrentWindow() {
    remote.getCurrentWindow().unmaximize();
}

export function saveCSVFile(fileName: string, data: string) {
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

        fs.writeFile(v.filePath, '\ufeff' + data, (err) => {
            if (err) {
                dialog.showMessageBox(remote.getCurrentWindow(), {
                    type: 'error',
                    message: 'An error ocurred creating the file ' + err.message,
                });
            }
            dialog.showMessageBox(remote.getCurrentWindow(), { type: 'info', message: '파일이 저장 되었습니다.' });
        });
    });
}

export function showMessageBox(options: Electron.MessageBoxOptions) {
    dialog.showMessageBox(remote.getCurrentWindow(), options);
}

export function saveExcelFile(fileName: string, data: any[][]) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    data.forEach((v) => worksheet.addRow(v));
    workbook.xlsx
        .writeBuffer()
        .then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, fileName);
        })
        .catch(() => {
            dialog.showMessageBox(remote.getCurrentWindow(), {
                type: 'error',
                message: 'An error ocurred creating the file',
            });
        });
}

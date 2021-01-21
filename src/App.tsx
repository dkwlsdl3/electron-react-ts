import React, { useState, useCallback } from 'react';
import { hot } from 'react-hot-loader';
import { Table } from './components/Table';
import { closeCurrentWindow, maximizeCurrentWindow, minimizeCurrentWindow, unmaximizeCurrentWindow } from './services/ipc';
import { get } from './services/service';
import { CSVLink } from 'react-csv';
import moment from 'moment';

const App = () => {
    const [id, setId] = useState<string>('');
    const [prodNo, setProdNo] = useState<string[]>([]);
    const [response, setResponse] = useState<string[][]>([]);
    const [isWindowMaximized, setIsWindowMaximized] = useState<boolean>(false);
    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setId(e.target.value);
    };
    const handleProdNoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setProdNo(e.target.value.split('\n'));
    };

    const handleClick = useCallback(async () => {
        setResponse(await get(id, prodNo));
    }, [id, prodNo, response]);

    return (
        <div>
            <nav className="titlebar flex items-center justify-between flex-wrap bg-green-500 px-3 py-1">
                <div className="flex items-center flex-no-shrink text-white mr-6">
                    <svg className="h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
                    </svg>
                    <span className="font-semibold text-xl tracking-tight">Merchant Tool</span>
                </div>
                <div className="flex">
                    <button
                        onClick={minimizeCurrentWindow}
                        className="titlebar-button flex items-center px-3 py-2 border rounded text-teal-lighter hover:text-white hover:border-white"
                    >
                        <i className="fas fa-window-minimize"></i>
                    </button>
                    {!isWindowMaximized && (
                        <button
                            onClick={() => {
                                maximizeCurrentWindow();
                                setIsWindowMaximized(true);
                            }}
                            className="titlebar-button flex items-center px-3 py-2 border rounded text-teal-lighter hover:text-white hover:border-white"
                        >
                            <i className="fas fa-window-maximize"></i>
                        </button>
                    )}
                    {isWindowMaximized && (
                        <button
                            onClick={() => {
                                unmaximizeCurrentWindow();
                                setIsWindowMaximized(false);
                            }}
                            className="titlebar-button flex items-center px-3 py-2 border rounded text-teal-lighter hover:text-white hover:border-white"
                        >
                            <i className="fas fa-window-restore"></i>
                        </button>
                    )}
                    <button
                        onClick={closeCurrentWindow}
                        className="titlebar-button flex items-center px-3 py-2 border rounded text-teal-lighter hover:text-white hover:border-white"
                    >
                        <i className="fas fa-window-close"></i>
                    </button>
                </div>
            </nav>
            <div className="mt-5 mx-auto w-10/12 flex flex-col border border-gray-300 p-4 shadow-lg">
                <input
                    className="bg-gray-100 border border-gray-300 p-2 mb-4 outline-none"
                    placeholder="판매자 ID"
                    type="text"
                    value={id}
                    onChange={handleIdChange}
                />
                <textarea
                    className="bg-gray-100 sec p-3 mb-4 h-60 border border-gray-300 outline-none"
                    placeholder="상품번호"
                    value={prodNo.join('\n')}
                    onChange={handleProdNoChange}
                />
                <div className="flex flex-row-reverse">
                    <div
                        className="btn border border-gray-800 p-1 px-8 py-1 font-semibold cursor-pointer text-black hover:text-white ml-2 bg-gray-300 hover:bg-gray-600 rounded-full"
                        onClick={handleClick}
                    >
                        검색
                    </div>
                </div>
            </div>
            {response.length > 0 && (
                <CSVLink filename={`${moment().format('YYMMDD')}_${id}.csv`} data={response}>
                    <div className="fixed right-5 bottom-5 rounded-full bg-green-600 text-white px-5 py-2" onClick={handleClick}>
                        <i className="fas fa-file-csv text-4xl"></i>
                    </div>
                </CSVLink>
            )}
            <br />
            {response.length >= 0 && <Table rows={response} />}
        </div>
    );
};

export default hot(module)(App);

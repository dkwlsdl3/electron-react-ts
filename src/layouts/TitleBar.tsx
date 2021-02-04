import React, { useState } from 'react';
import { closeCurrentWindow, maximizeCurrentWindow, minimizeCurrentWindow, unmaximizeCurrentWindow } from '../services/remote';

const TitleBar: React.FunctionComponent = () => {
    const [isWindowMaximized, setIsWindowMaximized] = useState<boolean>(false);

    return (
        <nav className="titlebar fixed w-full flex items-center justify-between flex-wrap bg-green-900 px-2.5 py-1.5 text-white">
            <div className="flex items-center flex-no-shrink mr-6">
                <svg className="h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
                </svg>
                <span className="font-semibold text-xl tracking-tight">Merchant Tool</span>
            </div>
            <div className="flex">
                <button onClick={minimizeCurrentWindow} className="titlebar-button flex items-center px-3 py-2 hover:bg-green-600">
                    <i className="fas fa-window-minimize"></i>
                </button>
                {!isWindowMaximized && (
                    <button
                        onClick={() => {
                            maximizeCurrentWindow();
                            setIsWindowMaximized(true);
                        }}
                        className="titlebar-button flex items-center px-3 py-2 hover:bg-green-600"
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
                        className="titlebar-button flex items-center px-3 py-2 hover:bg-green-600"
                    >
                        <i className="fas fa-window-restore"></i>
                    </button>
                )}
                <button onClick={closeCurrentWindow} className="titlebar-button flex items-center px-3 py-2 hover:bg-red-600">
                    <i className="fas fa-window-close"></i>
                </button>
            </div>
        </nav>
    );
};

export default TitleBar;

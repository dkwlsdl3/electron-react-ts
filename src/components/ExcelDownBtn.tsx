import React from 'react';

interface ExcelDownBtnProps {
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    className?: string;
}

const ExcelDownBtn = ({ onClick, className }: ExcelDownBtnProps) => {
    return (
        <div
            className={`fixed right-5 bottom-5 rounded-full bg-green-600 hover:bg-green-800 text-white px-5 py-2 cursor-pointer ${className}`}
            onClick={onClick}
        >
            <i className="fas fa-file-excel text-4xl"></i>
        </div>
    );
};

export default ExcelDownBtn;

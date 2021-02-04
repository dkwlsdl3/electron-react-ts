import React from 'react';

interface CSVDownBtnProps {
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const CSVDownBtn: React.FunctionComponent<CSVDownBtnProps> = ({ onClick }) => {
    return (
        <div
            className="fixed right-5 bottom-5 rounded-full bg-green-600 hover:bg-green-800 text-white px-5 py-2 cursor-pointer"
            onClick={onClick}
        >
            <i className="fas fa-file-csv text-4xl"></i>
        </div>
    );
};

export default CSVDownBtn;

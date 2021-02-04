import React from 'react';

interface SearchBtnProps {
    className?: string;
    btnName?: string;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const SearchBtn: React.FunctionComponent<SearchBtnProps> = ({ className, onClick, btnName }) => {
    return (
        <div className="flex flex-row-reverse">
            <div
                className={`btn border border-gray-800 p-1 px-8 py-1 font-semibold cursor-pointer text-black hover:text-white ml-2 bg-gray-300 hover:bg-gray-600 rounded-full ${className}`}
                onClick={onClick}
            >
                {btnName ? btnName : '검색'}
            </div>
        </div>
    );
};

export default SearchBtn;

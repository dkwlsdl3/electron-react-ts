import React from 'react';

interface DeleteBtnProps {
    className?: string;
    btnName?: string;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const DeleteBtn: React.FunctionComponent<DeleteBtnProps> = ({ className, onClick, btnName }) => {
    return (
        <div className="flex flex-row-reverse">
            <div
                className={`btn p-1 px-8 py-1 font-semibold cursor-pointer text-black hover:text-red-300 ml-2 bg-gray-300 hover:bg-gray-600 rounded-full ${className}`}
                onClick={onClick}
            >
                <i className="fas fa-trash-alt"></i>
            </div>
        </div>
    );
};

export default DeleteBtn;

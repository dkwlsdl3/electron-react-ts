import React from 'react';

interface InputProps {
    className?: string;
    placeholder?: string;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FunctionComponent<InputProps> = ({ className, placeholder, type, value, onChange }) => {
    return (
        <input
            className={`w-full bg-gray-100 border border-gray-300 border-solid p-2 mb-4 rounded focus:outline-none focus:border-green-600 ${className}`}
            placeholder={placeholder}
            type={type ? type : 'text'}
            value={value}
            onChange={onChange}
        />
    );
};

export default Input;

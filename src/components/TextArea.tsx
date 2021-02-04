import React from 'react';

interface TextAreaProps {
    className?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea: React.FunctionComponent<TextAreaProps> = ({ className, placeholder, value, onChange }) => {
    return (
        <textarea
            className={`w-full bg-gray-100 p-3 mb-4 h-60 border border-gray-300 border-solid rounded focus:outline-none focus:border-green-600 ${className}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
};

export default TextArea;

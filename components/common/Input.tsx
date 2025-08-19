import React from 'react';

type InputComponentProps = (
  React.InputHTMLAttributes<HTMLInputElement> & {
    id: string;
    textarea?: false;
  }
) | (
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    id: string;
    textarea: true;
  }
);

const Input: React.FC<InputComponentProps> = ({ id, textarea, ...props }) => {
    const commonClasses = "block w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors";
    
    if (textarea) {
        return (
            <textarea
                id={id}
                rows={4}
                className={commonClasses}
                {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
        );
    }

    return (
        <input
            id={id}
            className={commonClasses}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
    );
};

export default Input;

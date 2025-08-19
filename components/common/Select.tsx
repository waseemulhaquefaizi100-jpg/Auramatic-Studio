
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    id: string;
    label: string;
    children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ id, label, children, ...props }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
                {label}
            </label>
            <select
                id={id}
                className="block w-full pl-3 pr-10 py-2 text-base bg-gray-900/50 border-gray-700 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md transition-colors"
                {...props}
            >
                {children}
            </select>
        </div>
    );
};

export default Select;

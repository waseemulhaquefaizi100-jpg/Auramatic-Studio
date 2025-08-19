import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    fullWidth?: boolean;
    small?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, fullWidth = false, small = false, className, ...props }) => {
    const baseClasses = "font-semibold rounded-md transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
    const sizeClasses = small 
        ? "p-2 text-sm" 
        : "px-6 py-3 text-base";
    const colorClasses = "bg-red-600/80 border border-red-500 text-white hover:bg-red-600 active:scale-95 shadow-[0_0_5px_#ef4444,0_0_10px_#ef4444] hover:shadow-[0_0_15px_#ef4444,0_0_30px_#ef4444] hover:scale-105";
    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button className={`${baseClasses} ${sizeClasses} ${colorClasses} ${widthClass} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
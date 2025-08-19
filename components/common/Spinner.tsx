
import React from 'react';

interface SpinnerProps {
    large?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ large = false }) => {
    const sizeClasses = large ? 'w-12 h-12' : 'w-5 h-5';
    const borderClasses = large ? 'border-4' : 'border-2';

    return (
        <div className={`inline-block ${sizeClasses} animate-spin rounded-full ${borderClasses} border-solid border-current border-r-transparent align-[-0.125em] text-red-500 motion-reduce:animate-[spin_1.5s_linear_infinite]`} role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
    );
};

export default Spinner;

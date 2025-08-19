import React from 'react';
import { Page } from '../types';
import { ImageIcon, VideoIcon, EditIcon, LogoutIcon } from './common/Icon';

interface HeaderProps {
    setPage: (page: Page) => void;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ setPage, onLogout }) => {
    return (
        <header className="w-full p-4 flex justify-between items-center bg-black/50 backdrop-blur-sm z-10 sticky top-0 border-b border-red-500/30">
            <h1 
                className="text-xl md:text-3xl font-bold text-red-500 cursor-pointer animate-neon-glow"
                onClick={() => setPage(Page.HOME)}
            >
                Auramatic Studio
            </h1>
            <nav className="flex items-center gap-2 md:gap-4">
                 <button onClick={() => setPage(Page.IMAGE_GENERATOR)} className="text-gray-300 hover:text-red-500 transition-colors flex items-center gap-2 p-2 rounded-md hover:bg-red-500/10"><ImageIcon/> <span className="hidden md:inline">Image</span></button>
                 <button onClick={() => setPage(Page.VIDEO_GENERATOR)} className="text-gray-300 hover:text-red-500 transition-colors flex items-center gap-2 p-2 rounded-md hover:bg-red-500/10"><VideoIcon/> <span className="hidden md:inline">Video</span></button>
                 <button onClick={() => setPage(Page.IMAGE_EDITOR)} className="text-gray-300 hover:text-red-500 transition-colors flex items-center gap-2 p-2 rounded-md hover:bg-red-500/10"><EditIcon/> <span className="hidden md:inline">Image Editor</span></button>
                <button 
                    onClick={onLogout}
                    className="bg-red-600/20 border border-red-500 text-red-400 px-3 py-2 rounded-md hover:bg-red-500 hover:text-white transition-all duration-300 shadow-[0_0_5px_#ef4444] hover:shadow-[0_0_15px_#ef4444] flex items-center gap-2"
                >
                    <LogoutIcon />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </nav>
        </header>
    );
};

export default Header;
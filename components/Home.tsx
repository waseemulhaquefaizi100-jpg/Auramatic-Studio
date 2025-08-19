import React from 'react';
import { Page } from '../types';
import Button from './common/Button';

interface HomeProps {
    setPage: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ setPage }) => {
    return (
        <div className="text-center p-4 sm:p-8 bg-black/60 backdrop-blur-md border border-red-500/50 rounded-2xl shadow-2xl shadow-red-500/20">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-red-500 animate-neon-glow">Welcome to Auramatic Studio</h1>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-sm sm:text-base">
                Unleash your creativity. Generate breathtaking images and dynamic videos with the power of AI. Choose a tool below to get started.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
                <div 
                    onClick={() => setPage(Page.IMAGE_GENERATOR)}
                    className="group relative cursor-pointer p-6 sm:p-8 border border-red-500/50 rounded-lg bg-gray-900/50 hover:border-red-500 transition-all duration-300 hover:scale-105"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-200 group-hover:text-red-500 transition-colors">Image Generator</h2>
                    <p className="text-gray-400 mt-2">Craft stunning visuals from your imagination.</p>
                </div>
                <div 
                    onClick={() => setPage(Page.VIDEO_GENERATOR)}
                    className="group relative cursor-pointer p-6 sm:p-8 border border-red-500/50 rounded-lg bg-gray-900/50 hover:border-red-500 transition-all duration-300 hover:scale-105"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-200 group-hover:text-red-500 transition-colors">Video Generator</h2>
                    <p className="text-gray-400 mt-2">Bring your stories to life with AI-powered video.</p>
                </div>
                <div 
                    onClick={() => setPage(Page.IMAGE_EDITOR)}
                    className="group relative cursor-pointer p-6 sm:p-8 border border-red-500/50 rounded-lg bg-gray-900/50 hover:border-red-500 transition-all duration-300 md:col-span-1 hover:scale-105"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-200 group-hover:text-red-500 transition-colors">Image Editor</h2>
                    <p className="text-gray-400 mt-2">Retouch, edit, and enhance your images.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
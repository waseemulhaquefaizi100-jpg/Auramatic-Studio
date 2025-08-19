import React, { useState } from 'react';
import { Page } from './types';
import Auth from './components/Auth';
import Home from './components/Home';
import ImageGenerator from './components/ImageGenerator';
import VideoGenerator from './components/VideoGenerator';
import ImageEditor from './components/ImageEditor';
import Header from './components/Header';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>(Page.AUTH);

    const handleLogin = () => {
        setIsAuthenticated(true);
        setCurrentPage(Page.HOME);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentPage(Page.AUTH);
    }

    const renderPage = () => {
        if (!isAuthenticated) {
            return <Auth onLogin={handleLogin} />;
        }
        
        switch (currentPage) {
            case Page.HOME:
                return <Home setPage={setCurrentPage} />;
            case Page.IMAGE_GENERATOR:
                return <ImageGenerator />;
            case Page.VIDEO_GENERATOR:
                return <VideoGenerator />;
            case Page.IMAGE_EDITOR:
                return <ImageEditor />;
            default:
                return <Home setPage={setCurrentPage} />;
        }
    };

    return (
        <div className="min-h-screen bg-black/80 flex flex-col">
            {isAuthenticated && <Header setPage={setCurrentPage} onLogout={handleLogout} />}
            <main className="flex-grow flex items-center justify-center p-2 sm:p-4 lg:p-8">
                {renderPage()}
            </main>
        </div>
    );
};

export default App;
import React, { useState, useCallback } from 'react';
import Button from './common/Button';
import Input from './common/Input';
import Select from './common/Select';
import Spinner from './common/Spinner';
import Modal from './common/Modal';
import { VIDEO_ASPECT_RATIOS } from '../constants';
import { generateVideoFromText, generateVideoFromImage } from '../services/geminiService';
import type { GeneratedVideo } from '../types';
import { DownloadIcon, ExpandIcon, RefreshIcon, SparklesIcon, UploadIcon, PlayIcon, ZoomInIcon } from './common/Icon';

type Tab = 'text-to-video' | 'image-to-video';

const LOADING_MESSAGES = [
    "Warming up the digital director...",
    "Assembling pixels into motion...",
    "Rendering your cinematic vision...",
    "This can take a few minutes, hang tight!",
    "Choreographing the data stream...",
    "Final touches on the digital masterpiece..."
];


const VideoCard: React.FC<{
    video: GeneratedVideo;
    onPreview: (url: string) => void;
}> = ({ video, onPreview }) => {
    
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = video.videoUrl;
        link.download = `${video.prompt.substring(0, 20).replace(/\s+/g, '_')}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="group relative aspect-video bg-gray-900 rounded-lg overflow-hidden animate-fade-in shadow-lg">
            <video src={video.videoUrl} className="w-full h-full object-cover" muted loop playsInline onMouseOver={e => e.currentTarget.play()} onMouseOut={e => e.currentTarget.pause()}/>
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                <p className="text-white text-xs mb-2 text-center">{video.prompt}</p>
                 <div className="flex gap-2">
                    <Button onClick={() => onPreview(video.videoUrl)} small aria-label="Preview"><ExpandIcon/></Button>
                    <Button onClick={() => {}} small aria-label="Upscale"><ZoomInIcon/></Button>
                    <Button onClick={() => {}} small aria-label="Regenerate"><RefreshIcon/></Button>
                    <Button onClick={handleDownload} small aria-label="Download"><DownloadIcon/></Button>
                </div>
            </div>
        </div>
    );
};

const VideoGenerator: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('text-to-video');
    const [prompt, setPrompt] = useState('');
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState(VIDEO_ASPECT_RATIOS[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<GeneratedVideo[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || (activeTab === 'image-to-video' && !imageBase64)) return;

        setIsLoading(true);
        setError(null);

        const messageInterval = setInterval(() => {
            setLoadingMessage(prev => LOADING_MESSAGES[(LOADING_MESSAGES.indexOf(prev) + 1) % LOADING_MESSAGES.length]);
        }, 3000);

        try {
            let videoUrl: string;
            if (activeTab === 'image-to-video' && imageBase64) {
                videoUrl = await generateVideoFromImage(prompt, imageBase64, aspectRatio);
            } else {
                videoUrl = await generateVideoFromText(prompt, aspectRatio);
            }
            
            const newVideo: GeneratedVideo = {
                id: Date.now().toString(),
                prompt,
                aspectRatio,
                videoUrl,
                baseImageUrl: activeTab === 'image-to-video' ? imageBase64 : undefined,
            };
            setHistory(prev => [newVideo, ...prev]);

        } catch (err) {
            setError('Failed to generate video. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
            clearInterval(messageInterval);
        }
    };

    return (
       <div className="w-full max-w-8xl mx-auto flex flex-col gap-8 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 p-6 bg-gray-900/50 border border-red-500/30 rounded-lg">
                    <div className="flex border-b border-gray-700 mb-4">
                        <button onClick={() => setActiveTab('text-to-video')} className={`flex-1 py-2 text-center transition-colors ${activeTab === 'text-to-video' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}>Text to Video</button>
                        <button onClick={() => setActiveTab('image-to-video')} className={`flex-1 py-2 text-center transition-colors ${activeTab === 'image-to-video' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}>Image to Video</button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {activeTab === 'image-to-video' && (
                            <div>
                                <label htmlFor="image-upload" className="block text-sm font-medium text-gray-300 mb-2">Upload Image</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        {imageBase64 ? (
                                            <img src={imageBase64} alt="Upload preview" className="mx-auto h-24 w-auto rounded-md" />
                                        ) : (
                                            <UploadIcon className="mx-auto h-12 w-12 text-gray-500"/>
                                        )}
                                        <div className="flex text-sm text-gray-500">
                                            <label htmlFor="image-upload-input" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-red-500 hover:text-red-400 focus-within:outline-none p-1">
                                                <span>Upload a file</span>
                                                <input id="image-upload-input" name="image-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <Input
                            id="prompt"
                            placeholder="A neon hologram of a cat driving..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            textarea
                        />
                        <Select id="aspectRatio" label="Aspect Ratio" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
                            {VIDEO_ASPECT_RATIOS.map(ar => <option key={ar} value={ar}>{ar}</option>)}
                        </Select>
                        <Button type="submit" fullWidth disabled={isLoading}>
                            {isLoading ? <Spinner /> : <><PlayIcon /> <span>Generate Video</span></>}
                        </Button>
                        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                    </form>
                </div>

                <div className="lg:col-span-2 flex items-center justify-center bg-gray-900/50 border border-red-500/30 rounded-lg min-h-[300px] sm:min-h-[400px] p-4">
                    {isLoading && <div className="text-center"><Spinner large /><p className="mt-4 text-red-400">{loadingMessage}</p></div>}
                    {!isLoading && history.length > 0 && (
                        <video src={history[0].videoUrl} className="max-w-full max-h-[60vh] object-contain rounded-md" controls autoPlay muted loop playsInline />
                    )}
                    {!isLoading && history.length === 0 && (
                        <p className="text-gray-500">Your generated video will appear here.</p>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold mb-4 text-gray-300">History</h3>
                {history.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {history.map(vid => <VideoCard key={vid.id} video={vid} onPreview={setPreviewUrl} />)}
                    </div>
                ) : (
                    <p className="text-gray-600 text-center py-8">No videos generated yet.</p>
                )}
            </div>
             {previewUrl && (
                <Modal onClose={() => setPreviewUrl(null)}>
                    <video src={previewUrl} className="max-w-full max-h-[80vh] object-contain" controls autoPlay/>
                </Modal>
            )}
       </div>
    );
};

export default VideoGenerator;
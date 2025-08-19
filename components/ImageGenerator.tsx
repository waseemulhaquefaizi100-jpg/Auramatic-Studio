import React, { useState, useCallback } from 'react';
import Button from './common/Button';
import Input from './common/Input';
import Select from './common/Select';
import Spinner from './common/Spinner';
import Modal from './common/Modal';
import { IMAGE_STYLES, IMAGE_ASPECT_RATIOS } from '../constants';
import { generateImage } from '../services/geminiService';
import type { GeneratedImage } from '../types';
import { DownloadIcon, ExpandIcon, RefreshIcon, SparklesIcon, ZoomInIcon } from './common/Icon';

const ImageCard: React.FC<{
    image: GeneratedImage;
    onPreview: (url: string) => void;
    onRegenerate: (image: GeneratedImage) => void;
}> = ({ image, onPreview, onRegenerate }) => {
    
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = image.imageUrl;
        link.download = `${image.prompt.substring(0, 20).replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="group relative aspect-square bg-gray-900 rounded-lg overflow-hidden animate-fade-in shadow-lg">
            <img src={image.imageUrl} alt={image.prompt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                <div className="flex gap-2">
                    <Button onClick={() => onPreview(image.imageUrl)} small aria-label="Preview"><ExpandIcon/></Button>
                    <Button onClick={() => {}} small aria-label="Upscale"><ZoomInIcon/></Button>
                    <Button onClick={() => onRegenerate(image)} small aria-label="Regenerate"><RefreshIcon/></Button>
                    <Button onClick={handleDownload} small aria-label="Download"><DownloadIcon/></Button>
                </div>
            </div>
        </div>
    );
};

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState(IMAGE_STYLES[0]);
    const [aspectRatio, setAspectRatio] = useState(IMAGE_ASPECT_RATIOS[0].value);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<GeneratedImage[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleGenerate = useCallback(async (p: string, s: string, ar: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const imageUrl = await generateImage(p, s, ar as any);
            const newImage: GeneratedImage = {
                id: Date.now().toString(),
                prompt: p,
                style: s,
                aspectRatio: ar,
                imageUrl,
            };
            setHistory(prev => [newImage, ...prev]);
        } catch (err) {
            setError('Failed to generate image. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            handleGenerate(prompt, style, aspectRatio);
        }
    };

    const handleRegenerate = (image: GeneratedImage) => {
        handleGenerate(image.prompt, image.style, image.aspectRatio);
    }

    return (
        <div className="w-full max-w-8xl mx-auto flex flex-col gap-8 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <form onSubmit={handleSubmit} className="lg:col-span-1 space-y-4 p-6 bg-gray-900/50 border border-red-500/30 rounded-lg">
                    <h2 className="text-2xl font-bold text-red-500">Create Image</h2>
                    <Input
                        id="prompt"
                        placeholder="A red neon robot holding a skateboard..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        textarea
                    />
                    <Select id="style" label="Style" value={style} onChange={(e) => setStyle(e.target.value)}>
                        {IMAGE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                    <Select id="aspectRatio" label="Aspect Ratio" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
                        {IMAGE_ASPECT_RATIOS.map(ar => <option key={ar.value} value={ar.value}>{ar.label}</option>)}
                    </Select>
                    <Button type="submit" fullWidth disabled={isLoading}>
                        {isLoading ? <Spinner /> : <><SparklesIcon /> <span>Generate</span></>}
                    </Button>
                    {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                </form>

                <div className="lg:col-span-2 flex items-center justify-center bg-gray-900/50 border border-red-500/30 rounded-lg min-h-[300px] sm:min-h-[400px] p-4">
                    {isLoading && <Spinner large />}
                    {!isLoading && history.length > 0 && (
                         <img src={history[0].imageUrl} alt={history[0].prompt} className="max-w-full max-h-[60vh] object-contain rounded-md" />
                    )}
                    {!isLoading && history.length === 0 && (
                        <p className="text-gray-500">Your generated image will appear here.</p>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold mb-4 text-gray-300">History</h3>
                {history.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {history.map(img => (
                            <ImageCard key={img.id} image={img} onPreview={setPreviewUrl} onRegenerate={handleRegenerate} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-center py-8">No images generated yet.</p>
                )}
            </div>
             {previewUrl && (
                <Modal onClose={() => setPreviewUrl(null)}>
                    <img src={previewUrl} alt="Preview" className="max-w-full max-h-[80vh] object-contain"/>
                </Modal>
            )}
        </div>
    );
};

export default ImageGenerator;
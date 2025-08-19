import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BackgroundIcon, TextRemoveIcon, ObjectRemoveIcon, DownloadIcon, UploadIcon, BrushIcon, EraserIcon, SparklesIcon, BackArrowIcon, EnhanceIcon } from './common/Icon';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { performImageEditing } from '../services/geminiService';

type Tool = 'background' | 'text' | 'object' | 'enhancer';

const toolConfig = {
    background: {
        name: 'Background Remover',
        icon: BackgroundIcon,
        description: 'Upload an image to automatically remove the background. Use the brush to refine the selection.',
        prompt: 'Remove the background from this image. The output must be a PNG with a transparent background.',
        brushPrompt: 'From the main image, remove the background and also remove the area specified in the provided mask image. The output must be a PNG with a transparent background.',
    },
    text: {
        name: 'Text Remover',
        icon: TextRemoveIcon,
        description: 'Automatically detect and remove text. Use the brush to select any remaining text.',
        prompt: 'Detect and remove all text from this image, seamlessly filling in the background (inpainting).',
        brushPrompt: 'From the main image, remove the text located in the area specified by the provided mask image. Seamlessly fill in the background (inpainting).',
    },
    object: {
        name: 'Object Remover',
        icon: ObjectRemoveIcon,
        description: 'Use the brush to paint over an object or defect you want to remove.',
        prompt: null, // No auto-mode
        brushPrompt: 'Remove the object from the main image that is located in the area specified by the provided mask image. Seamlessly fill in the background (inpainting).',
    },
    enhancer: {
        name: 'Image Enhancer',
        icon: EnhanceIcon,
        description: 'Automatically improve image quality, color, and sharpness.',
        prompt: 'Enhance the quality of this image. Improve sharpness, color balance, and lighting.',
        brushPrompt: null,
    },
};

interface CanvasEditorProps {
    src: string;
    onMaskUpdate: (maskDataUrl: string) => void;
    brushSize: number;
    isErasing: boolean;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ src, onMaskUpdate, brushSize, isErasing }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const lastPointRef = useRef<{x: number, y: number} | null>(null);

    const drawLine = (x0: number, y0: number, x1: number, y1: number, context: CanvasRenderingContext2D) => {
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.stroke();
    };
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = src;
        image.onload = () => {
            if (canvas && container) {
                const containerWidth = container.clientWidth;
                const scale = Math.min(1, containerWidth / image.width);
                canvas.width = image.width * scale;
                canvas.height = image.height * scale;

                const ctx = canvas.getContext('2d');
                if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };
    }, [src]);

    const getCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const touch = 'touches' in e ? e.touches[0] : e;
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        lastPointRef.current = getCoords(e);
    };

    const finishDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        lastPointRef.current = null;
        if (canvasRef.current) {
            onMaskUpdate(canvasRef.current.toDataURL());
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !canvasRef.current) return;
        
        const context = canvasRef.current.getContext('2d');
        if (!context) return;
        
        const currentPoint = getCoords(e);
        if (lastPointRef.current) {
            context.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
            context.strokeStyle = 'rgba(239, 68, 68, 1)';
            context.lineWidth = brushSize;
            context.lineCap = 'round';
            context.lineJoin = 'round';
            drawLine(lastPointRef.current.x, lastPointRef.current.y, currentPoint.x, currentPoint.y, context);
        }
        lastPointRef.current = currentPoint;
    };

    return (
        <div ref={containerRef} className="relative w-full aspect-auto">
            <img src={src} alt="Original" className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-md object-contain" />
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseLeave={finishDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={finishDrawing}
                onTouchMove={draw}
                className="cursor-crosshair w-full h-full"
            />
        </div>
    );
};

const ImageEditor: React.FC = () => {
    const [activeTool, setActiveTool] = useState<Tool | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [maskImage, setMaskImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [brushSize, setBrushSize] = useState(20);
    const [isErasing, setIsErasing] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalImage(reader.result as string);
                setEditedImage(null);
                setMaskImage(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleToolSelect = (tool: Tool) => {
        setActiveTool(tool);
        setOriginalImage(null);
        setEditedImage(null);
        setMaskImage(null);
        setError(null);
    };

    const runProcess = useCallback(async (prompt: string, mask?: string) => {
        if (!originalImage) return;
        setIsLoading(true);
        setError(null);
        try {
            const result = await performImageEditing(originalImage, prompt, mask);
            setEditedImage(result);
        } catch (err: any) {
            setError(err.message || 'An error occurred during processing.');
        } finally {
            setIsLoading(false);
        }
    }, [originalImage]);

    useEffect(() => {
        if (activeTool === 'enhancer' && originalImage && !editedImage && !isLoading) {
            const prompt = toolConfig.enhancer.prompt;
            if (prompt) {
                runProcess(prompt);
            }
        }
    }, [activeTool, originalImage, editedImage, isLoading, runProcess]);

    const handleDownload = () => {
        if (!editedImage) return;
        const link = document.createElement('a');
        link.href = editedImage;
        link.download = `edited_${activeTool}_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => {
        const config = toolConfig[tool];
        const Icon = config.icon;
        return (
            <div
                onClick={() => handleToolSelect(tool)}
                className="group relative cursor-pointer p-6 border border-red-500/50 rounded-lg bg-gray-900/50 hover:border-red-500 hover:scale-105 transition-all duration-300 text-center"
            >
                <Icon className="w-12 h-12 mx-auto text-red-500" />
                <h3 className="text-xl md:text-2xl font-bold text-gray-200 mt-4">{config.name}</h3>
            </div>
        );
    };

    return (
        <div className="w-full max-w-8xl mx-auto flex flex-col gap-8 p-4 bg-gray-900/50 border border-red-500/30 rounded-lg">
            {!activeTool ? (
                <>
                    <h1 className="text-3xl md:text-4xl font-bold text-center text-red-500 animate-neon-glow">Image Editor</h1>
                    <p className="text-center text-gray-400">Select a tool to get started</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ToolCard tool="background" />
                        <ToolCard tool="text" />
                        <ToolCard tool="object" />
                        <ToolCard tool="enhancer" />
                    </div>
                </>
            ) : (
                <div>
                    <div className="flex items-center gap-4 mb-6">
                        <button onClick={() => setActiveTool(null)} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors p-2 rounded-md hover:bg-red-500/10"><BackArrowIcon/><span>Back</span></button>
                        <h2 className="text-2xl md:text-3xl font-bold text-red-500">{toolConfig[activeTool].name}</h2>
                    </div>

                    {!originalImage ? (
                        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-600 rounded-lg text-center">
                            <UploadIcon className="w-16 h-16 text-gray-500" />
                            <p className="mt-4 text-gray-400">{toolConfig[activeTool].description}</p>
                            <label htmlFor="image-upload-input" className="mt-4 bg-red-600/80 text-white px-6 py-3 rounded-md cursor-pointer hover:bg-red-600 transition-colors shadow-[0_0_5px_#ef4444] hover:shadow-[0_0_15px_#ef4444] flex items-center gap-2">
                                <UploadIcon className="w-5 h-5" />
                                <span>Upload Image</span>
                            </label>
                            <input id="image-upload-input" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {activeTool === 'enhancer' ? (
                                <>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="flex flex-col items-center">
                                        <h3 className="text-xl font-bold mb-2">Original</h3>
                                        <img src={originalImage} alt="Original" className="w-full h-auto object-contain rounded-md" />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <h3 className="text-xl font-bold mb-2">Result</h3>
                                        <div className="w-full aspect-auto min-h-[300px] bg-black/50 border border-gray-700 rounded-md flex items-center justify-center p-2">
                                            {isLoading && <Spinner large />}
                                            {!isLoading && editedImage && <img src={editedImage} alt="Edited result" className="w-full h-auto object-contain" />}
                                            {!isLoading && !editedImage && <p className="text-gray-500">Enhancing your image...</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-800/50 rounded-lg flex items-center justify-end gap-4">
                                     <Button onClick={handleDownload} disabled={!editedImage || isLoading}><DownloadIcon /> <span>Download</span></Button>
                                </div>
                                </>
                            ) : (
                                <>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="flex flex-col items-center">
                                        <h3 className="text-xl font-bold mb-2">Editor</h3>
                                        <div className="p-2 bg-gray-800 rounded-md w-full">
                                            <CanvasEditor src={originalImage} onMaskUpdate={setMaskImage} brushSize={brushSize} isErasing={isErasing} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <h3 className="text-xl font-bold mb-2">Result</h3>
                                        <div className="w-full aspect-auto min-h-[300px] bg-black/50 border border-gray-700 rounded-md flex items-center justify-center p-2">
                                            {isLoading && <Spinner large />}
                                            {!isLoading && editedImage && <img src={editedImage} alt="Edited result" className="w-full h-auto object-contain" />}
                                            {!isLoading && !editedImage && <p className="text-gray-500">Your result will appear here.</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-800/50 rounded-lg flex flex-col xl:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
                                        <span className="text-gray-300 text-sm sm:text-base">Brush Tools:</span>
                                        <button onClick={() => setIsErasing(false)} className={`p-2 rounded-md transition-colors ${!isErasing ? 'bg-red-500/50 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`} aria-label="Brush"><BrushIcon /></button>
                                        <button onClick={() => setIsErasing(true)} className={`p-2 rounded-md transition-colors ${isErasing ? 'bg-red-500/50 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`} aria-label="Eraser"><EraserIcon /></button>
                                        <input type="range" min="5" max="100" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-24 sm:w-32" />
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap justify-center">
                                        {toolConfig[activeTool].prompt && <Button onClick={() => runProcess(toolConfig[activeTool].prompt!)} disabled={isLoading}><SparklesIcon /><span>Auto</span></Button>}
                                        <Button onClick={() => runProcess(toolConfig[activeTool].brushPrompt!, maskImage ?? undefined)} disabled={!maskImage || isLoading}><BrushIcon/><span>Apply</span></Button>
                                        <Button onClick={handleDownload} disabled={!editedImage || isLoading} aria-label="Download Image"><DownloadIcon /><span>Download</span></Button>
                                    </div>
                                </div>
                                </>
                            )}
                             {error && <p className="text-red-400 text-center p-2 bg-red-900/50 rounded-md">{error}</p>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageEditor;
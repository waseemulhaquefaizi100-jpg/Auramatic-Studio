import { GoogleGenAI } from "@google/genai";
import type { GenerateImagesResponse, GenerateVideosOperation, GenerateVideosResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using mock data.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const MOCK_IMAGE_URL = 'https://picsum.photos/1024/1024';
const MOCK_VIDEO_URL = 'https://videos.pexels.com/video-files/3209828/3209828-sd_640_360_30fps.mp4';

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

export const generateImage = async (prompt: string, style: string, aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9"): Promise<string> => {
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return MOCK_IMAGE_URL;
    }

    const fullPrompt = style !== 'Default' ? `${prompt}, in the style of ${style}` : prompt;

    const response: GenerateImagesResponse = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: fullPrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: aspectRatio,
        },
    });

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/png;base64,${base64ImageBytes}`;
};

const pollVideoOperation = async (operation: GenerateVideosOperation): Promise<GenerateVideosResponse> => {
    if (!ai) return { generatedVideos: [{ video: { uri: MOCK_VIDEO_URL } }] };
    
    let currentOperation = operation;
    while (!currentOperation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
        currentOperation = await ai.operations.getVideosOperation({ operation: currentOperation });
    }
    return currentOperation.response as GenerateVideosResponse;
};


export const generateVideoFromText = async (prompt: string, aspectRatio: string): Promise<string> => {
    const fullPrompt = `${prompt}, aspect ratio ${aspectRatio}`;
    
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        return MOCK_VIDEO_URL;
    }

    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: fullPrompt,
        config: {
            numberOfVideos: 1,
        }
    });

    const result = await pollVideoOperation(operation);
    const downloadLink = result?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed or returned no link.");

    const videoResponse = await fetch(`${downloadLink}&key=${API_KEY}`);
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
};

export const generateVideoFromImage = async (prompt: string, imageBase64: string, aspectRatio: string): Promise<string> => {
    const fullPrompt = `${prompt}, aspect ratio ${aspectRatio}`;
    const mimeType = imageBase64.substring(imageBase64.indexOf(":") + 1, imageBase64.indexOf(";"));
    const imageData = imageBase64.split(',')[1];
    
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        return MOCK_VIDEO_URL;
    }

    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: fullPrompt,
        image: {
            imageBytes: imageData,
            mimeType: mimeType,
        },
        config: {
            numberOfVideos: 1
        }
    });
    
    const result = await pollVideoOperation(operation);
    const downloadLink = result?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed or returned no link.");

    const videoResponse = await fetch(`${downloadLink}&key=${API_KEY}`);
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
};

export const performImageEditing = async (imageBase64: string, prompt: string, maskBase64?: string): Promise<string> => {
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Simple mock: return original image for demonstration
        return imageBase64;
    }

    try {
        const mimeType = imageBase64.substring(imageBase64.indexOf(":") + 1, imageBase64.indexOf(";"));
        const imageData = imageBase64.split(',')[1];
        const imagePart = { inlineData: { mimeType, data: imageData } };

        // This prompt structure asks the model to return a base64 string directly in its text response.
        const fullPrompt = `${prompt}. The output must be a single base64 encoded string of the resulting image, without any other text or markdown formatting.`;
        const textPart = { text: fullPrompt };

        const parts: any[] = [textPart, imagePart];

        if (maskBase64) {
            const maskMimeType = maskBase64.substring(maskBase64.indexOf(":") + 1, maskBase64.indexOf(";"));
            const maskData = maskBase64.split(',')[1];
            const maskPart = { inlineData: { mimeType: maskMimeType, data: maskData } };
            parts.push(maskPart);
        }
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: parts },
             config: {
                // Ask for a text response, which we will parse as a base64 string
                responseMimeType: "text/plain",
            }
        });

        const base64Result = response.text.trim();
        // Clean up potential markdown code blocks and newlines from the response.
        const cleanedBase64 = base64Result.replace(/```(json|plaintext|png|)?/g, '').replace(/[\r\n]/g, '').trim();

        if (!cleanedBase64) {
            throw new Error("API returned an empty response.");
        }
        
        // A simple validation to check if the response looks like a base64 string.
        if (!/^[A-Za-z0-9+/=]+$/.test(cleanedBase64)) {
            console.error("API did not return a valid base64 string:", base64Result);
            throw new Error("Received an invalid format from the API. Please try again.");
        }

        return `data:image/png;base64,${cleanedBase64}`;
    } catch (error) {
        console.error("Error in performImageEditing:", error);
        throw new Error("Failed to edit image. The model may have returned an unexpected response.");
    }
};
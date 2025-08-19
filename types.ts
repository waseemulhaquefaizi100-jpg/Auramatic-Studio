export enum Page {
  AUTH,
  HOME,
  IMAGE_GENERATOR,
  VIDEO_GENERATOR,
  IMAGE_EDITOR,
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  imageUrl: string;
}

export interface GeneratedVideo {
  id: string;
  prompt: string;
  baseImageUrl?: string;
  aspectRatio: string;
  videoUrl: string;
}
import React from 'react';

const iconProps = {
    className: "w-5 h-5 text-gray-300",
    fill: "currentColor"
};

export const GoogleIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

export const FacebookIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06c0 5.52 4.5 10.02 10 10.02s10-4.5 10-10.02C22 6.53 17.5 2.04 12 2.04zm2.6 10.92h-2.14v6.52h-3.2v-6.52H8.3v-2.7h1.96V8.56c0-1.63.8-2.56 2.5-2.56h2.1v2.7h-1.4c-.6 0-.7.3-.7.7v1.4h2.2l-.26 2.7z" />
    </svg>
);

export const AppleIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M19.33 12.25c0-2.28-1.55-3.86-3.75-3.86-1.58 0-2.83.94-3.58 2.3-1.1-1.46-2.65-2.3-4.25-2.3-2.2 0-4.08 1.6-4.08 3.86 0 2.83 2.05 6.52 4.4 6.52 1.3 0 2.25-.8 3.43-.8s2.05.8 3.43.8c2.43 0 4.4-3.69 4.4-6.52zm-5.25-5.27c.8-.9 1.38-2.13 1.28-3.38-.98.05-2.18.6-3.03 1.5-.75.8-1.43 2.03-1.28 3.28.98-.05 2.18-.6 3.03-1.4z" />
    </svg>
);

export const GithubIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .3z" />
    </svg>
);

export const InstagramIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
    </svg>
);

export const LoginIcon: React.FC = () => (
    <svg {...actionIconProps}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" /></svg>
);

export const LogoutIcon: React.FC = () => (
     <svg {...actionIconProps} className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
);

export const ImageIcon: React.FC = () => (
    <svg {...actionIconProps} className="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
);

export const VideoIcon: React.FC = () => (
    <svg {...actionIconProps} className="w-5 h-5"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2" ry="2"/></svg>
);

export const EditIcon: React.FC = () => (
    <svg {...actionIconProps} className="w-5 h-5"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
);

export const PlayIcon: React.FC = () => (
    <svg {...actionIconProps}><path d="M5 3l14 9-14 9V3z"/></svg>
);

const actionIconProps: React.SVGProps<SVGSVGElement> = {
    className: "w-5 h-5",
    strokeWidth: 2,
    stroke: "currentColor",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeLinecap: "round",
    strokeLinejoin: "round",
};

export const ExpandIcon: React.FC = () => (
    <svg {...actionIconProps}><path d="M15 3h6v6M9 21H3v-6M3 3l7 7M21 21l-7-7" /></svg>
);

export const SparklesIcon: React.FC = () => (
    <svg {...actionIconProps}><path d="M12 3v2.35M12 18.65V21M3 12h2.35M18.65 12H21M5.64 5.64l1.66 1.66M16.7 16.7l1.66 1.66M5.64 18.36l1.66-1.66M16.7 7.3l1.66-1.66" /></svg>
);

export const RefreshIcon: React.FC = () => (
    <svg {...actionIconProps}><path d="M21 12a9 9 0 11-6.219-8.56" /><path d="M21 3v5h-5" /></svg>
);

export const DownloadIcon: React.FC = () => (
    <svg {...actionIconProps}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
);

export const ZoomInIcon: React.FC = () => (
    <svg {...actionIconProps}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
);

interface UploadIconProps {
    className?: string;
}

export const UploadIcon: React.FC<UploadIconProps> = ({className}) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
     </svg>
);


const editorIconProps: React.SVGProps<SVGSVGElement> = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
};

export const BackgroundIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...editorIconProps} {...props}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0"></path><path d="M12 12a5 5 0 0 0-5 5v0a5 5 0 0 0 10 0v0a5 5 0 0 0-5-5z"></path></svg>
);

export const TextRemoveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...editorIconProps} {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9.5" y1="12.5" x2="14.5" y2="17.5"></line><line x1="14.5" y1="12.5" x2="9.5" y2="17.5"></line></svg>
);

export const ObjectRemoveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...editorIconProps} {...props}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><line x1="3.27" y1="6.96" x2="12" y2="12.01"></line><line x1="12" y1="22.08" x2="12" y2="12"></line><line x1="20.73" y1="6.96" x2="12" y2="12.01"></line><line x1="17" y1="4.24" x2="7" y2="9.76"></line></svg>
);

export const EnhanceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...editorIconProps} {...props}><path d="M12 3v2.35M12 18.65V21M3 12h2.35M18.65 12H21M5.64 5.64l1.66 1.66M16.7 16.7l1.66 1.66M5.64 18.36l1.66-1.66M16.7 7.3l1.66-1.66"/><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
);

export const BrushIcon: React.FC = () => (
    <svg {...actionIconProps}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);

export const EraserIcon: React.FC = () => (
    <svg {...actionIconProps}><path d="M19.34 18.34c-2.34-2.34-5.46-3.67-8.68-3.67-1.9 0-3.68.53-5.1 1.45L2.22 19.5a.5.5 0 0 0 .7.7l3.34-3.34c.92-1.42 2.4-2.58 4.08-3.17 1.57-.55 3.24-.8 4.9-.8 3.22 0 6.34 1.33 8.68 3.67a1 1 0 0 0 1.42 0l.7-.7a1 1 0 0 0 0-1.42zM5.5 13.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>
);

export const BackArrowIcon: React.FC = () => (
    <svg {...actionIconProps}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
);
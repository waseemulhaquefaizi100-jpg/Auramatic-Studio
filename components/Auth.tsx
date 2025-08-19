import React, { useState } from 'react';
import Button from './common/Button';
import Input from './common/Input';
import { GithubIcon, GoogleIcon, InstagramIcon, AppleIcon, FacebookIcon, LoginIcon } from './common/Icon';

interface AuthProps {
    onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isSignUp, setIsSignUp] = useState(false);

    const SocialButton: React.FC<{ icon: React.ReactNode; 'aria-label': string }> = ({ icon, 'aria-label': ariaLabel }) => (
        <button 
            onClick={onLogin}
            aria-label={ariaLabel}
            className="p-3 bg-gray-800 border border-red-500/50 rounded-full hover:bg-red-500/20 hover:border-red-500 transition-all duration-300"
        >
            {icon}
        </button>
    );

    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-black/60 backdrop-blur-md border border-red-500/50 rounded-2xl shadow-2xl shadow-red-500/20">
            <div>
                <h1 className="text-4xl font-bold text-center text-red-500 animate-neon-glow">
                    Auramatic Studio
                </h1>
                <p className="mt-2 text-center text-gray-400">
                    {isSignUp ? 'Create your account to begin' : 'Welcome back, creator'}
                </p>
            </div>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                <Input id="email" type="email" placeholder="Email Address" required />
                <Input id="password" type="password" placeholder="Password" required />
                {isSignUp && (
                     <Input id="birthdate" type="date" placeholder="Birth Date" required />
                )}
                <Button type="submit" fullWidth>
                    <LoginIcon />
                    <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
                </Button>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-black text-gray-500">Or continue with</span>
                </div>
            </div>
            <div className="flex justify-center gap-4">
                <SocialButton icon={<GoogleIcon />} aria-label="Sign in with Google" />
                <SocialButton icon={<FacebookIcon />} aria-label="Sign in with Facebook" />
                <SocialButton icon={<AppleIcon />} aria-label="Sign in with Apple" />
                <SocialButton icon={<GithubIcon />} aria-label="Sign in with Github" />
                <SocialButton icon={<InstagramIcon />} aria-label="Sign in with Instagram" />
            </div>
            <div className="text-center text-sm text-gray-400">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-red-500 hover:text-red-400 ml-1">
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
            </div>
        </div>
    );
};

export default Auth;
import type { FC } from 'react';
import { Link } from 'react-router-dom';

const Header: FC = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                            Atlas Fiber
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/">
                            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors cursor-pointer">
                                Inicio
                            </button>
                        </Link>
                        <Link to="/dashboard">
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors cursor-pointer">
                                Ir a Dashboard
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

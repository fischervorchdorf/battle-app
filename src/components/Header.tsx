import React from 'react';
import { Swords, Zap } from 'lucide-react';

export const Header: React.FC = () => {
    return (
        <header className="bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 text-white py-6 px-6 shadow-2xl border-b-4 border-yellow-400">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-400 rounded-xl text-gray-900 shadow-lg">
                        <Swords size={32} className="animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-wider" style={{ fontFamily: "'Bangers', cursive" }}>
                            GLEICH ist NICHT GLEICH
                        </h1>
                        <p className="text-sm text-yellow-200 uppercase tracking-widest font-semibold">
                            ⚔️ Epic Battle Simulator • Powered by KI
                        </p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/30">
                    <Zap size={20} className="text-yellow-300" />
                    <span className="text-sm font-bold">AI-Powered</span>
                </div>
            </div>
        </header>
    );
};

import React from 'react';

export const LoadingState: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative">
                {/* Rotating swords */}
                <div className="w-24 h-24 relative">
                    <div className="absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">⚔️</div>
                </div>
            </div>
            <h3 className="mt-8 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
                Battle wird analysiert...
            </h3>
            <p className="mt-2 text-gray-400">Die KI berechnet Stärken, Schwächen und Szenarien</p>
            <p className="mt-4 text-sm text-gray-500">⏱️ Kann bis zu 30 Sekunden dauern</p>
        </div>
    );
};

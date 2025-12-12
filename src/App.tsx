import React, { useState } from 'react';
import { Header } from './components/Header';
import { DualImageUpload } from './components/DualImageUpload';
import { BattleResultsView } from './components/BattleResultsView';
import { LoadingState } from './components/LoadingState';
import { analyzeBattle } from './services/geminiService';
import { AppState, BattleResult } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>(AppState.IDLE);
    const [image1, setImage1] = useState<File | null>(null);
    const [image2, setImage2] = useState<File | null>(null);
    const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleImagesSelected = async (img1: File, img2: File) => {
        setImage1(img1);
        setImage2(img2);
        setError(null);
        setAppState(AppState.ANALYZING);

        try {
            const result = await analyzeBattle(img1, img2);
            setBattleResult(result);
            setAppState(AppState.RESULTS);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Die Battle-Analyse ist fehlgeschlagen. Ein KI-Experiment des Heimatvereins Vorchdorf (v5.1)");
            setAppState(AppState.ERROR);
        }
    };

    const handleReset = () => {
        setImage1(null);
        setImage2(null);
        setBattleResult(null);
        setError(null);
        setAppState(AppState.IDLE);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto max-w-7xl py-8">

                {appState === AppState.IDLE && (
                    <div className="text-center">
                        <div className="mb-8">
                            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">
                                Wer würde gewinnen?
                            </h2>
                            <p className="text-xl text-gray-400">
                                Lade zwei Bilder hoch und lass die KI entscheiden, wer in einem epischen Kampf siegen würde!
                            </p>
                        </div>
                        <DualImageUpload onImagesSelected={handleImagesSelected} />
                    </div>
                )}

                {appState === AppState.ANALYZING && (
                    <LoadingState />
                )}

                {appState === AppState.RESULTS && image1 && image2 && battleResult && (
                    <BattleResultsView
                        image1={image1}
                        image2={image2}
                        result={battleResult}
                        onReset={handleReset}
                    />
                )}

                {appState === AppState.ERROR && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-red-500/20 p-6 rounded-full mb-4 border-4 border-red-500">
                            <AlertCircle size={48} className="text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Battle-Fehler!</h3>
                        <p className="text-gray-400 max-w-md mb-8">{error}</p>
                        <button
                            onClick={handleReset}
                            className="px-6 py-3 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg hover:scale-105 transition-transform font-bold"
                        >
                            Erneut versuchen
                        </button>
                    </div>
                )}

            </main>

            <footer className="bg-gray-950 border-t border-gray-800 py-6">
                <div className="container mx-auto text-center text-sm text-gray-500">
                    <p>⚔️ {new Date().getFullYear()} Gleich ist NICHT Gleich • Powered by Gemini AI • Just for Fun!</p>
                </div>
            </footer>
        </div>
    );
};

export default App;

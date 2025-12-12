import React from 'react';
import { BattleResult } from '../types';
import { Trophy, Shield, Zap, Heart, Brain, Target, ArrowLeft, Download, Mail, Share2 } from 'lucide-react';

interface BattleResultsViewProps {
    image1: File;
    image2: File;
    result: BattleResult;
    onReset: () => void;
}

export const BattleResultsView: React.FC<BattleResultsViewProps> = ({ image1, image2, result, onReset }) => {
    const imageUrl1 = React.useMemo(() => URL.createObjectURL(image1), [image1]);
    const imageUrl2 = React.useMemo(() => URL.createObjectURL(image2), [image2]);
    const [shareMessage, setShareMessage] = React.useState('');

    const shareText = `⚔️ BATTLE ERGEBNIS ⚔️\n\n${result.combatant1.name} VS ${result.combatant2.name}\n\nSIEGER: ${result.winner === 1 ? result.combatant1.name : result.combatant2.name} (${result.winProbability}%)\n\n${result.verdict}`;

    const handleDownloadScreenshot = async () => {
        try {
            const element = document.getElementById('battle-results');
            if (!element) return;

            const html2canvas = (await import('html2canvas')).default;
            const canvas = await html2canvas(element);

            canvas.toBlob((blob: Blob | null) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `battle-${result.combatant1.name}-vs-${result.combatant2.name}.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                    setShareMessage('Screenshot heruntergeladen!');
                    setTimeout(() => setShareMessage(''), 3000);
                }
            });
        } catch (error) {
            console.error('Screenshot failed:', error);
            setShareMessage('Screenshot fehlgeschlagen');
            setTimeout(() => setShareMessage(''), 3000);
        }
    };

    const handleEmailShare = () => {
        const subject = `Battle: ${result.combatant1.name} vs ${result.combatant2.name}`;
        const body = encodeURIComponent(shareText + '\n\nErstellt mit "Gleich ist NICHT Gleich" Battle App');
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
        setShareMessage('E-Mail geöffnet!');
        setTimeout(() => setShareMessage(''), 3000);
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Battle: ${result.combatant1.name} vs ${result.combatant2.name}`,
                    text: shareText,
                });
                setShareMessage('Geteilt!');
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    console.error('Share failed:', error);
                }
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(shareText);
            setShareMessage('Text kopiert!');
            setTimeout(() => setShareMessage(''), 3000);
        }
    };

    const getStatIcon = (statName: string) => {
        switch (statName) {
            case 'strength': return <Shield size={16} className="text-red-400" />;
            case 'speed': return <Zap size={16} className="text-yellow-400" />;
            case 'defense': return <Shield size={16} className="text-blue-400" />;
            case 'agility': return <Target size={16} className="text-green-400" />;
            case 'intelligence': return <Brain size={16} className="text-purple-400" />;
            case 'stamina': return <Heart size={16} className="text-pink-400" />;
            default: return null;
        }
    };

    const getStatColor = (value: number) => {
        if (value >= 80) return 'bg-green-500';
        if (value >= 60) return 'bg-yellow-500';
        if (value >= 40) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const StatBar: React.FC<{ label: string; value: number; icon: React.ReactNode }> = ({ label, value, icon }) => (
        <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-sm font-semibold capitalize">{label}</span>
                </div>
                <span className="text-sm font-bold">{value}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                    className={`h-full ${getStatColor(value)} transition-all duration-1000 ease-out`}
                    style={{ width: `${value}%` }}
                ></div>
            </div>
        </div>
    );

    const CombatantCard: React.FC<{
        combatant: typeof result.combatant1;
        image: string;
        isWinner: boolean;
        color: string;
    }> = ({ combatant, image, isWinner, color }) => (
        <div className={`relative rounded-2xl overflow-hidden border-4 ${isWinner ? `border-yellow-400 shadow-2xl shadow-yellow-500/50` : `border-gray-600`} bg-gray-800`}>
            {isWinner && (
                <div className="absolute top-4 right-4 z-10 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg animate-bounce">
                    <Trophy size={20} />
                    SIEGER!
                </div>
            )}

            {/* Image only - no text overlay */}
            <div className="relative h-80 bg-gray-900 flex items-center justify-center">
                <img src={image} alt={combatant.name} className="w-full h-full object-contain" />
            </div>

            {/* Info box below image */}
            <div className={`p-4 bg-gradient-to-r ${color === 'red' ? 'from-red-900 to-red-800' : 'from-blue-900 to-blue-800'} border-t-4 ${color === 'red' ? 'border-red-500' : 'border-blue-500'}`}>
                <h2 className="text-2xl font-bold text-white">{combatant.name}</h2>
                <p className="text-sm text-gray-200 mt-1">{combatant.description}</p>
            </div>

            <div className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    📊 Stats
                </h3>
                {Object.entries(combatant.stats).map(([key, value]) => (
                    <StatBar key={key} label={key} value={value} icon={getStatIcon(key)} />
                ))}

                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-bold text-green-400 mb-2">💪 Stärken</h4>
                        <ul className="text-sm space-y-1">
                            {combatant.strengths.map((s, i) => (
                                <li key={i} className="text-gray-300">✓ {s}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-red-400 mb-2">⚠️ Schwächen</h4>
                        <ul className="text-sm space-y-1">
                            {combatant.weaknesses.map((w, i) => (
                                <li key={i} className="text-gray-300">✗ {w}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div id="battle-results" className="w-full max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                    Neuer Battle
                </button>

                <div className="flex items-center gap-3">
                    {shareMessage && (
                        <span className="text-green-400 text-sm font-semibold animate-pulse">{shareMessage}</span>
                    )}
                    <button
                        onClick={handleDownloadScreenshot}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        title="Als Bild speichern"
                    >
                        <Download size={18} />
                        <span className="hidden sm:inline">Screenshot</span>
                    </button>
                    <button
                        onClick={handleEmailShare}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                        title="Per E-Mail senden"
                    >
                        <Mail size={18} />
                        <span className="hidden sm:inline">E-Mail</span>
                    </button>
                    <button
                        onClick={handleNativeShare}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                        title="Teilen"
                    >
                        <Share2 size={18} />
                        <span className="hidden sm:inline">Teilen</span>
                    </button>
                </div>
            </div>

            {/* Win Probability */}
            <div className="mb-8 text-center">
                <div className="inline-block px-8 py-4 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 rounded-2xl border-4 border-yellow-400 shadow-2xl">
                    <h2 className="text-2xl font-bold mb-2">⚔️ BATTLE ERGEBNIS ⚔️</h2>
                    <p className="text-3xl font-bold">
                        {result.winner === 1 ? result.combatant1.name : result.combatant2.name} gewinnt!
                    </p>
                    <p className="text-xl mt-2">
                        Siegwahrscheinlichkeit: <span className="text-yellow-300 font-bold">{result.winProbability}%</span>
                    </p>
                </div>
            </div>

            {/* Combatant Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <CombatantCard
                    combatant={result.combatant1}
                    image={imageUrl1}
                    isWinner={result.winner === 1}
                    color="red"
                />
                <CombatantCard
                    combatant={result.combatant2}
                    image={imageUrl2}
                    isWinner={result.winner === 2}
                    color="blue"
                />
            </div>

            {/* Scenarios */}
            <div className="bg-gray-800 rounded-2xl p-8 border-2 border-gray-700 mb-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    🎮 Szenarien-Analyse
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {result.scenarios.map((scenario, i) => (
                        <div key={i} className={`p-6 rounded-xl border-2 ${scenario.advantage === 1 ? 'border-red-500 bg-red-900/20' : 'border-blue-500 bg-blue-900/20'
                            }`}>
                            <h4 className="font-bold text-lg mb-2">{scenario.title}</h4>
                            <p className="text-gray-300 mb-3">{scenario.description}</p>
                            <div className="flex items-center gap-2">
                                <Trophy size={16} className="text-yellow-400" />
                                <span className="font-semibold">
                                    Vorteil: {scenario.advantage === 1 ? result.combatant1.name : result.combatant2.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Verdict */}
            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-8 border-2 border-purple-500">
                <h3 className="text-2xl font-bold mb-4">🏆 Finales Urteil</h3>
                <p className="text-lg leading-relaxed text-gray-200">{result.verdict}</p>
            </div>
        </div>
    );
};

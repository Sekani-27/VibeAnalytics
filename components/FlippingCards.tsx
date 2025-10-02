import React, { useState } from 'react';
import { AnalysisResult, Sentiment } from '../types';

interface FlippingCardsProps {
    results: AnalysisResult[];
    isGlassmorphismEnabled: boolean;
}

const CARD_SUITS = ['♠', '♥', '♦', '♣'];
const CARD_COLORS: Record<string, string> = {
    '♠': '#000',
    '♣': '#000',
    '♥': '#e11d48',
    '♦': '#e11d48',
};

const SENTIMENT_COLORS: Record<Sentiment, { bg: string; text: string; glow: string }> = {
    [Sentiment.POSITIVE]: {
        bg: 'bg-gradient-to-br from-green-500 to-emerald-600',
        text: 'text-green-50',
        glow: 'shadow-[0_0_20px_rgba(34,197,94,0.6)]',
    },
    [Sentiment.NEGATIVE]: {
        bg: 'bg-gradient-to-br from-red-500 to-rose-600',
        text: 'text-red-50',
        glow: 'shadow-[0_0_20px_rgba(239,68,68,0.6)]',
    },
    [Sentiment.NEUTRAL]: {
        bg: 'bg-gradient-to-br from-gray-500 to-slate-600',
        text: 'text-gray-50',
        glow: 'shadow-[0_0_20px_rgba(107,114,128,0.6)]',
    },
};

const FlippingCards: React.FC<FlippingCardsProps> = ({ results, isGlassmorphismEnabled }) => {
    const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

    const toggleCard = (index: number) => {
        setFlippedCards((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const containerClasses = `relative overflow-hidden border rounded-xl p-6 transition-colors duration-300 ${isGlassmorphismEnabled ? 'glass-panel' : 'bg-slate-800 border-slate-700'}`;

    const displayResults = results.slice(0, 10);

    return (
        <div className={containerClasses}>
            <style>{`
                .card-container {
                    perspective: 1000px;
                }
                .card {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                    transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
                }
                .card.flipped {
                    transform: rotateY(180deg);
                }
                .card-face {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    border-radius: 0.75rem;
                    display: flex;
                    flex-direction: column;
                    padding: 1rem;
                }
                .card-front {
                    background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
                    border: 2px solid #e5e7eb;
                }
                .card-back {
                    transform: rotateY(180deg);
                }
            `}</style>

            <h3 className="text-lg font-semibold text-white mb-4">Sentiment Cards</h3>
            <p className="text-sm text-gray-400 mb-6">Click any card to flip and reveal the sentiment analysis</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {displayResults.map((result, index) => {
                    const isFlipped = flippedCards.has(index);
                    const suit = CARD_SUITS[index % 4];
                    const suitColor = CARD_COLORS[suit];
                    const sentimentStyle = SENTIMENT_COLORS[result.sentiment];
                    const confidencePercent = (result.confidence * 100).toFixed(1);

                    return (
                        <div
                            key={index}
                            className="card-container cursor-pointer"
                            onClick={() => toggleCard(index)}
                        >
                            <div className="aspect-[2/3] relative">
                                <div className={`card ${isFlipped ? 'flipped' : ''}`}>
                                    <div className="card-face card-front">
                                        <div className="flex justify-between items-start">
                                            <span className="text-2xl font-bold" style={{ color: suitColor }}>
                                                {index + 1}
                                            </span>
                                            <span className="text-3xl" style={{ color: suitColor }}>
                                                {suit}
                                            </span>
                                        </div>
                                        <div className="flex-grow flex items-center justify-center">
                                            <span className="text-6xl" style={{ color: suitColor }}>
                                                {suit}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end transform rotate-180">
                                            <span className="text-2xl font-bold" style={{ color: suitColor }}>
                                                {index + 1}
                                            </span>
                                            <span className="text-3xl" style={{ color: suitColor }}>
                                                {suit}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={`card-face card-back ${sentimentStyle.bg} ${sentimentStyle.glow}`}>
                                        <div className="flex flex-col h-full justify-between items-center text-center">
                                            <div className={`text-xs font-bold ${sentimentStyle.text} uppercase tracking-wide`}>
                                                {result.sentiment}
                                            </div>

                                            <div className="flex-grow flex flex-col items-center justify-center">
                                                <div className={`text-4xl font-bold ${sentimentStyle.text} mb-2`}>
                                                    {confidencePercent}%
                                                </div>
                                                <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                                                    <div
                                                        className="bg-white h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${confidencePercent}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div className={`text-xs ${sentimentStyle.text} line-clamp-2 px-1`}>
                                                "{result.text.substring(0, 60)}..."
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {results.length === 0 && (
                <div className="text-center text-gray-400 py-12">
                    <p>No results to display. Analyze some text first!</p>
                </div>
            )}
        </div>
    );
};

export default FlippingCards;

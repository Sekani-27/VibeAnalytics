import React from 'react';
import { Sentiment } from '../types';

interface SentimentDonutChartProps {
    data: { name: string; value: number }[];
    isGlassmorphismEnabled: boolean;
    onFilterChange: (sentiment: Sentiment | null) => void;
    activeFilter: Sentiment | null;
}

const COLORS: { [key: string]: string } = {
    Positive: '#4ade80', // green-400
    Negative: '#f87171', // red-400
    Neutral: '#a3a3a3',  // neutral-400
};

const SENTIMENT_EMOJIS = {
    POSITIVE: '😊',
    NEGATIVE: '😠',
    NEUTRAL: '😐',
};

const DieFace: React.FC<{ face: string; emoji: string }> = ({ face, emoji }) => {
    return (
        <div className={`face ${face}`}>
            <span className="emoji-text" role="img" aria-label={`${face} face emoji`}>{emoji}</span>
        </div>
    );
};


const SentimentDonutChart: React.FC<SentimentDonutChartProps> = ({ data, isGlassmorphismEnabled, onFilterChange, activeFilter }) => {
    const containerClasses = `relative overflow-hidden border rounded-xl p-6 h-full flex flex-col min-h-[350px] transition-colors duration-300 ${isGlassmorphismEnabled ? 'glass-panel' : 'bg-slate-800 border-slate-700'}`;

    const totalValue = data.reduce((sum, item) => sum + item.value, 0);

    const handleFilterClick = (sentimentName: string) => {
        const sentiment = sentimentName.toUpperCase() as Sentiment;
        if (activeFilter === sentiment) {
            onFilterChange(null); // Toggle off if already active
        } else {
            onFilterChange(sentiment);
        }
    };

    return (
        <div className={containerClasses}>
            <style>{`
                .scene {
                    width: 100px;
                    height: 100px;
                    perspective: 600px;
                }
                .cube {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    transform-style: preserve-3d;
                    animation: spin-cube 12s infinite linear;
                }
                .face {
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(5px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .emoji-text {
                    font-size: 50px;
                    text-shadow: 0 0 8px #fff, 0 0 12px #c084fc, 0 0 16px #c084fc;
                }

                .front  { transform: rotateY(  0deg) translateZ(50px); }
                .back   { transform: rotateY(180deg) translateZ(50px); }
                .right  { transform: rotateY( 90deg) translateZ(50px); }
                .left   { transform: rotateY(-90deg) translateZ(50px); }
                .top    { transform: rotateX( 90deg) translateZ(50px); }
                .bottom { transform: rotateX(-90deg) translateZ(50px); }

                @keyframes spin-cube {
                    from { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
                    to   { transform: rotateX(360deg) rotateY(720deg) rotateZ(360deg); }
                }
            `}</style>
            <h3 className="text-lg font-semibold text-white mb-4">Sentiment Distribution</h3>
            <div className="flex-grow flex flex-col items-center justify-center">
                <div className="scene my-6">
                    <div className="cube">
                        <DieFace face="front" emoji={SENTIMENT_EMOJIS.POSITIVE} />
                        <DieFace face="back" emoji={SENTIMENT_EMOJIS.NEGATIVE} />
                        <DieFace face="right" emoji={SENTIMENT_EMOJIS.NEUTRAL} />
                        <DieFace face="left" emoji={SENTIMENT_EMOJIS.POSITIVE} />
                        <DieFace face="top" emoji={SENTIMENT_EMOJIS.NEGATIVE} />
                        <DieFace face="bottom" emoji={SENTIMENT_EMOJIS.NEUTRAL} />
                    </div>
                </div>
                 <div className="flex justify-around w-full mt-6 pt-6 border-t border-white/10">
                    {data.map((item) => {
                         const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
                         const sentimentKey = item.name.toUpperCase() as Sentiment;
                         const isActive = activeFilter === sentimentKey;
                         
                         return (
                            <div 
                                key={item.name} 
                                className={`text-center p-2 rounded-lg cursor-pointer transition-all duration-300 ${isActive ? 'bg-purple-500/20' : 'hover:bg-white/10'}`}
                                onClick={() => handleFilterClick(item.name)}
                                style={isActive ? {boxShadow: `0 0 15px ${COLORS[item.name]}`} : {}}
                                title={`Filter by ${item.name}`}
                            >
                                <p className="text-sm font-medium" style={{ color: COLORS[item.name] }}>{item.name}</p>
                                <p className="text-2xl font-bold text-white mt-1">{percentage.toFixed(0)}%</p>
                                <p className="text-xs text-gray-400">({item.value} results)</p>
                            </div>
                         )
                    })}
                </div>
            </div>
        </div>
    );
};

export default SentimentDonutChart;
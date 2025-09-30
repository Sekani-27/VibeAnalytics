import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    trend: 'up' | 'down' | 'stable' | 'wave';
    color: 'green' | 'red' | 'gray' | 'purple';
    isGlassmorphismEnabled: boolean;
}

const TrendIcon: React.FC<{ trend: StatCardProps['trend'] }> = ({ trend }) => {
    const className = "w-5 h-5";
    switch (trend) {
        case 'up':
            return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
        case 'down':
            return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>
        case 'stable':
            return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" x2="19" y1="12" y2="12"/></svg>
        case 'wave':
            return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
    }
};

const colorClasses = {
    green: {
        text: 'text-green-300',
        bg: 'bg-green-400',
        shadow: 'shadow-[0_0_15px_rgba(74,222,128,0.5)]',
        border: 'border-green-700'
    },
    red: {
        text: 'text-red-400',
        bg: 'bg-red-400',
        shadow: 'shadow-[0_0_15px_rgba(248,113,113,0.5)]',
        border: 'border-red-700'
    },
    gray: {
        text: 'text-gray-300',
        bg: 'bg-gray-400',
        shadow: 'shadow-[0_0_15px_rgba(163,163,163,0.4)]',
        border: 'border-gray-600'
    },
    purple: {
        text: 'text-purple-400',
        bg: 'bg-purple-500',
        shadow: 'shadow-[0_0_15px_rgba(192,132,252,0.5)]',
        border: 'border-purple-700'
    },
};

const trendTooltips: Record<StatCardProps['trend'], string> = {
    up: 'Positive Trend',
    down: 'Negative Trend',
    stable: 'Stable Value',
    wave: 'Confidence Fluctuation',
};

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, color, isGlassmorphismEnabled }) => {
    const styles = colorClasses[color];
    const numericValue = parseFloat(value);
    const containerClasses = `relative overflow-hidden border rounded-xl p-5 transition-colors duration-300 ${isGlassmorphismEnabled ? `glass-panel` : `bg-slate-800 ${styles.border}`}`;
    const tooltipText = trendTooltips[trend];


    return (
        <div className={containerClasses}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-400 font-medium">{title}</p>
                    <p className={`text-3xl font-bold mt-1 ${styles.text}`}>{value}</p>
                </div>
                <div className={`relative group ${styles.text} bg-white/10 p-2 rounded-lg transition-transform duration-200 hover:scale-110 cursor-pointer`}>
                    <TrendIcon trend={trend} />
                     <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 border border-slate-700 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {tooltipText}
                    </span>
                </div>
            </div>
            <div className="mt-4">
                <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                        className={`${styles.bg} ${styles.shadow} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${numericValue}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
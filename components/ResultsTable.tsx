import React from 'react';
import { AnalysisResult, Sentiment } from '../types';
import { Frown } from 'lucide-react';

interface ResultsTableProps {
    results: AnalysisResult[];
    isGlassmorphismEnabled: boolean;
}

const sentimentClasses: Record<Sentiment, { badge: string; text: string; bar: string }> = {
    [Sentiment.POSITIVE]: {
        badge: 'bg-green-500/20',
        text: 'text-green-300',
        bar: 'bg-green-500',
    },
    [Sentiment.NEGATIVE]: {
        badge: 'bg-red-500/20',
        text: 'text-red-400',
        bar: 'bg-red-500',
    },
    [Sentiment.NEUTRAL]: {
        badge: 'bg-gray-500/20',
        text: 'text-gray-400',
        bar: 'bg-gray-500',
    },
};

const ResultsTable: React.FC<ResultsTableProps> = ({ results, isGlassmorphismEnabled }) => {
     const containerClasses = `relative overflow-hidden border rounded-xl p-6 transition-colors duration-300 ${isGlassmorphismEnabled ? 'glass-panel' : 'bg-slate-800 border-slate-700'}`;

    return (
        <div className={containerClasses}>
            <h3 className="text-lg font-semibold text-white mb-4">Detailed Analysis</h3>
            <div className="overflow-y-auto max-h-96 pr-2 space-y-4">
                {results.length > 0 ? (
                    results.map((result, index) => {
                        const sentimentStyle = sentimentClasses[result.sentiment];
                        return (
                            <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10 animate-fade-in">
                                <p className="text-gray-300 mb-3 leading-relaxed">"{result.text}"</p>
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${sentimentStyle.badge} ${sentimentStyle.text}`}>
                                        {result.sentiment}
                                    </span>
                                    <div className="flex items-center w-full sm:w-auto sm:min-w-[150px]">
                                        <div className="w-full bg-slate-700 rounded-full h-2 mr-2">
                                            <div 
                                                className={`${sentimentStyle.bar} h-2 rounded-full`}
                                                style={{ width: `${result.confidence * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className={`text-sm font-semibold ${sentimentStyle.text}`}>
                                            {(result.confidence * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center text-center text-gray-400 py-12 animate-fade-in">
                        <Frown className="w-12 h-12 mb-4 text-purple-400/50" />
                        <p className="font-semibold">No results match the current filter.</p>
                        <p className="text-sm">Try selecting a different sentiment or clearing the filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsTable;
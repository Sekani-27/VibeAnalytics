import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AnalysisResult, Sentiment } from './types';
import { analyzeSentences } from './services/geminiService';
import AnalyzerView from './components/AnalyzerView';
import DashboardView from './components/DashboardView';
import { BrainCircuit, Sparkles, AlertTriangle } from 'lucide-react';

function App() {
    const [results, setResults] = useState<AnalysisResult[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isGlassmorphismEnabled, setIsGlassmorphismEnabled] = useState(true);
    const [isFlipped, setIsFlipped] = useState(false);
    const [filterSentiment, setFilterSentiment] = useState<Sentiment | null>(null);
    const [isApiKeyConfigured, setIsApiKeyConfigured] = useState(true);

    useEffect(() => {
        // In a static deployment without a build step, `process` is undefined.
        // This check prevents the app from crashing and instead shows a setup guide.
        if (typeof process === 'undefined' || !process.env.API_KEY) {
            setIsApiKeyConfigured(false);
        }
    }, []);


    const handleAnalyze = useCallback(async (text: string) => {
        setIsLoading(true);
        setError(null);
        setFilterSentiment(null); // Reset filter on new analysis
        try {
            const analysisResults = await analyzeSentences(text);
            setResults(analysisResults);
            setIsFlipped(true); // Trigger the flip to the dashboard
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const filteredResults = useMemo(() => {
        if (!filterSentiment) {
            return results;
        }
        return results.filter(r => r.sentiment === filterSentiment);
    }, [results, filterSentiment]);

    const dashboardData = useMemo(() => {
        if (results.length === 0) {
            return {
                positivePercentage: 0,
                negativePercentage: 0,
                neutralPercentage: 0,
                avgConfidence: 0,
                sentimentDistribution: [],
                recentScores: [],
                totalAnalyzed: 0,
                positiveCount: 0,
                negativeCount: 0,
            };
        }

        const totalAnalyzed = results.length;
        const positiveCount = results.filter(r => r.sentiment === Sentiment.POSITIVE).length;
        const negativeCount = results.filter(r => r.sentiment === Sentiment.NEGATIVE).length;
        const neutralCount = totalAnalyzed - positiveCount - negativeCount;

        const totalConfidence = results.reduce((sum, r) => sum + r.confidence, 0);

        return {
            positivePercentage: (positiveCount / totalAnalyzed) * 100,
            negativePercentage: (negativeCount / totalAnalyzed) * 100,
            neutralPercentage: (neutralCount / totalAnalyzed) * 100,
            avgConfidence: (totalConfidence / totalAnalyzed) * 100,
            sentimentDistribution: [
                { name: 'Positive', value: positiveCount },
                { name: 'Negative', value: negativeCount },
                { name: 'Neutral', value: neutralCount },
            ],
            recentScores: results.map((r, i) => ({ name: `Text ${i + 1}`, confidence: r.confidence * 100 })),
            totalAnalyzed,
            positiveCount,
            negativeCount,
        };
    }, [results]);

    const handleExport = (format: 'csv' | 'json') => {
        let dataStr: string;
        let fileName: string;
        let mimeType: string;

        if (format === 'json') {
            dataStr = JSON.stringify(results, null, 2);
            fileName = 'sentiment_analysis.json';
            mimeType = 'application/json';
        } else {
            const header = 'Text,Sentiment,Confidence\n';
            const rows = results.map(r => `"${r.text.replace(/"/g, '""')}",${r.sentiment},${r.confidence}`).join('\n');
            dataStr = header + rows;
            fileName = 'sentiment_analysis.csv';
            mimeType = 'text/csv';
        }

        const blob = new Blob([dataStr], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    const isDashboardVisible = isFlipped && results.length > 0;

    if (!isApiKeyConfigured) {
        return (
            <div className="min-h-screen bg-black/10 backdrop-blur-xl text-gray-200 font-sans p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                <style>{`
                    .glass-panel-error {
                        background-color: rgba(239, 68, 68, 0.05);
                        backdrop-filter: blur(16px);
                        border-color: rgba(239, 68, 68, 0.2);
                    }
                `}</style>
                <div className="max-w-2xl w-full mx-auto text-center glass-panel-error border border-red-500/50 rounded-2xl p-8 shadow-2xl shadow-red-500/10">
                    <div className="inline-flex items-center justify-center bg-red-900/50 rounded-full p-3 mb-4 border border-red-700 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]">
                        <AlertTriangle className="text-red-400 w-10 h-10" strokeWidth="1.5"/>
                    </div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-4">Configuration Required</h1>
                    <p className="text-lg text-gray-300 mb-2">
                        Welcome to VibeAnalytics! To get started, you need to provide your Gemini API key.
                    </p>
                    <p className="text-gray-400">
                        The application can't find the necessary <code>API_KEY</code>. Please add it as an environment variable in your deployment platform's settings (e.g., Vercel, Netlify) and then redeploy your project.
                    </p>
                    <div className="mt-6 text-left bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <p className="text-sm font-semibold text-gray-300">Variable Name:</p>
                        <code className="text-purple-300 bg-black/20 px-2 py-1 rounded-md text-sm">API_KEY</code>
                        <p className="text-sm font-semibold text-gray-300 mt-3">Value:</p>
                        <code className="text-purple-300 bg-black/20 px-2 py-1 rounded-md text-sm">[Your_Gemini_API_Key]</code>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black/10 backdrop-blur-xl text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
            <style>{`
                @property --aurora-angle {
                    syntax: '<angle>';
                    initial-value: 0deg;
                    inherits: false;
                }
                @keyframes aurora {
                    0% { --aurora-angle: 0deg; }
                    100% { --aurora-angle: 360deg; }
                }
                .glass-panel {
                    background-color: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(16px);
                    border-color: rgba(255, 255, 255, 0.1);
                }
                .glass-panel::before {
                    content: '';
                    position: absolute;
                    inset: -1px;
                    border-radius: inherit;
                    padding: 2px; /* Border thickness */
                    background: conic-gradient(
                        from var(--aurora-angle, 0deg),
                        rgba(168, 85, 247, 0.4),  /* purple-500/40 */
                        rgba(56, 189, 248, 0.4), /* cyan-400/40 */
                        rgba(236, 72, 153, 0.4), /* pink-500/40 */
                        rgba(168, 85, 247, 0.4)
                    );
                    -webkit-mask:
                        linear-gradient(#fff 0 0) content-box,
                        linear-gradient(#fff 0 0);
                    mask:
                        linear-gradient(#fff 0 0) content-box,
                        linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    animation: aurora 4s linear infinite;
                    pointer-events: none;
                }
            `}</style>
            <div className="max-w-7xl mx-auto relative">
                <header className="text-center mb-8">
                    <div className="inline-flex items-center justify-center bg-purple-900/50 rounded-full p-3 mb-4 border border-purple-700 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">
                         <BrainCircuit className="text-purple-400 w-10 h-10" strokeWidth="1.5"/>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">VibeAnalytics</h1>
                    <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
                        AI-powered sentiment analysis with a glowing, futuristic interface. Explore emotional insights through interactive visualizations.
                    </p>
                </header>

                <main>
                    <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                        <div className="flex items-center bg-slate-800 rounded-full p-1 border border-slate-700">
                             <button
                                onClick={() => { setIsFlipped(false); setFilterSentiment(null); }}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${!isDashboardVisible ? 'bg-purple-600 text-white shadow-md' : 'text-gray-300 hover:bg-slate-700'}`}
                            >
                                Analyzer
                            </button>
                             <button
                                onClick={() => { if (results.length > 0) setIsFlipped(true); }}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${isDashboardVisible ? 'bg-purple-600 text-white shadow-md' : 'text-gray-300 hover:bg-slate-700'}`}
                                disabled={results.length === 0}
                            >
                                Dashboard
                            </button>
                        </div>
                         {isDashboardVisible && (
                            <div className="flex items-center space-x-2">
                                <button onClick={() => handleExport('csv')} className="flex items-center text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-lg transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/></svg>
                                    Export CSV
                                </button>
                                <button onClick={() => handleExport('json')} className="flex items-center text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-lg transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/></svg>
                                    Export JSON
                                </button>
                                <label htmlFor="glass-toggle" className="flex items-center cursor-pointer ml-2" title="Toggle Glassmorphism Effect">
                                    <Sparkles className={`w-5 h-5 mr-2 transition-colors ${isGlassmorphismEnabled ? 'text-purple-400' : 'text-gray-500'}`} />
                                    <div className="relative">
                                        <input id="glass-toggle" type="checkbox" className="sr-only" checked={isGlassmorphismEnabled} onChange={() => setIsGlassmorphismEnabled(!isGlassmorphismEnabled)} />
                                        <div className={`block w-10 h-6 rounded-full transition-colors ${isGlassmorphismEnabled ? 'bg-purple-600' : 'bg-slate-600'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isGlassmorphismEnabled ? 'transform translate-x-4' : ''}`}></div>
                                    </div>
                                </label>
                            </div>
                        )}
                    </div>
                    
                    <div style={{ perspective: '1200px', minHeight: '800px' }}>
                        <div
                            className="relative w-full h-full transition-transform duration-700 ease-in-out"
                            style={{
                                transformStyle: 'preserve-3d',
                                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            }}
                        >
                            {/* Front Face */}
                            <div style={{ backfaceVisibility: 'hidden' }} className="absolute w-full h-full">
                                <AnalyzerView onAnalyze={handleAnalyze} isLoading={isLoading} error={error} isGlassmorphismEnabled={isGlassmorphismEnabled} />
                            </div>

                            {/* Back Face */}
                            <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }} className="absolute w-full h-full">
                               {results.length > 0 ? (
                                    <DashboardView 
                                        data={dashboardData} 
                                        results={results}
                                        filteredResults={filteredResults} 
                                        isGlassmorphismEnabled={isGlassmorphismEnabled}
                                        filterSentiment={filterSentiment}
                                        onFilterChange={setFilterSentiment}
                                    />
                                ) : (
                                    <div className={`relative overflow-hidden border rounded-xl p-6 h-full flex flex-col items-center justify-center transition-colors duration-300 ${isGlassmorphismEnabled ? 'glass-panel' : 'bg-slate-800 border-slate-700'}`}>
                                       <p className="text-gray-400 text-lg">Analysis results will appear here after you analyze some text.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;

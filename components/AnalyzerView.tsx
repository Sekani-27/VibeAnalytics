import React, { useState, useRef, useCallback } from 'react';

interface AnalyzerViewProps {
    onAnalyze: (text: string) => void;
    isLoading: boolean;
    error: string | null;
    isGlassmorphismEnabled: boolean;
}

const exampleText = `The new phone's battery life is amazing and the camera quality is superb. 
I had a terrible experience with their customer service; they were not helpful at all.
The movie was okay, not great but not bad either.
I'm absolutely thrilled with the results of the project!
Unfortunately, the package arrived damaged and two days late.
The user interface is intuitive and easy to navigate.`;

const AnalyzerView: React.FC<AnalyzerViewProps> = ({ onAnalyze, isLoading, error, isGlassmorphismEnabled }) => {
    const [text, setText] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (file: File | null) => {
        if (!file) return;

        if (file.type === 'text/plain' || file.type === 'text/markdown') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fileContent = e.target?.result as string;
                setText(fileContent);
                setFileName(file.name);
            };
            reader.readAsText(file);
        } else {
            alert('Unsupported file type. Please upload a .txt or .md file.');
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileChange(files[0]);
        }
    }, []);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onAnalyze(text);
        }
    };

    const containerClasses = `relative overflow-hidden border rounded-xl p-6 sm:p-8 max-w-3xl mx-auto animate-fade-in transition-colors duration-300 ${isGlassmorphismEnabled ? 'glass-panel' : 'bg-slate-800 border-slate-700'}`;

    return (
        <div className={containerClasses}>
            <h2 className="text-2xl font-bold text-white mb-4">Analyze Text</h2>
            <p className="text-gray-400 mb-6">Enter text, upload a file, or drag and drop. Our AI will analyze sentiment sentence by sentence.</p>
            
            <form onSubmit={handleSubmit}>
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleUploadClick}
                    className={`mb-4 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-slate-600 hover:border-slate-500 hover:bg-white/10'}`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".txt,.md"
                        onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-gray-500 mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                    <p className="text-sm text-gray-400">
                        {fileName ? `File: ${fileName}` : "Drag & drop a .txt or .md file, or click to browse"}
                    </p>
                </div>

                <div className="relative">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Or enter multiple sentences here..."
                        className="w-full h-48 p-4 bg-white/5 border border-white/10 rounded-lg text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder-gray-500"
                        disabled={isLoading}
                    />
                    <button 
                        type="button" 
                        onClick={() => setText(exampleText)}
                        className="absolute top-2 right-2 text-xs bg-slate-700 hover:bg-slate-600 text-gray-300 px-2 py-1 rounded transition-colors"
                        disabled={isLoading}
                    >
                        Load Example
                    </button>
                </div>
                
                {error && <p className="text-red-400 mt-4">{error}</p>}

                <div className="mt-6 flex justify-between items-center">
                    <button 
                        type="button"
                        onClick={() => { setText(''); setFileName(null); }}
                        disabled={isLoading || !text.trim()}
                        className="px-4 py-2 text-sm bg-slate-700 text-gray-300 font-semibold rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Clear
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || !text.trim()}
                        className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:shadow-none"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing...
                            </>
                        ) : (
                            'Analyze Sentiment'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AnalyzerView;
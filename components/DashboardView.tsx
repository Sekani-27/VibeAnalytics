import React from 'react';
import { DashboardData, AnalysisResult, Sentiment } from '../types';
import StatCard from './StatCard';
import SentimentDonutChart from './SentimentDonutChart';
import ConfidenceBarChart from './ConfidenceBarChart';
import RadarChartSummary from './RadarChartSummary';
import ResultsTable from './ResultsTable';
import { FilterX } from 'lucide-react';

interface DashboardViewProps {
    data: DashboardData;
    results: AnalysisResult[];
    filteredResults: AnalysisResult[];
    isGlassmorphismEnabled: boolean;
    filterSentiment: Sentiment | null;
    onFilterChange: (sentiment: Sentiment | null) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ data, results, filteredResults, isGlassmorphismEnabled, filterSentiment, onFilterChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            <StatCard 
                title="Positive" 
                value={`${data.positivePercentage.toFixed(1)}%`} 
                trend="up"
                color="green"
                isGlassmorphismEnabled={isGlassmorphismEnabled}
            />
            <StatCard 
                title="Negative" 
                value={`${data.negativePercentage.toFixed(1)}%`}
                trend="down"
                color="red"
                isGlassmorphismEnabled={isGlassmorphismEnabled}
            />
            <StatCard 
                title="Neutral" 
                value={`${data.neutralPercentage.toFixed(1)}%`}
                trend="stable"
                color="gray"
                isGlassmorphismEnabled={isGlassmorphismEnabled}
            />
            <StatCard 
                title="Avg Confidence" 
                value={`${data.avgConfidence.toFixed(1)}%`}
                trend="wave"
                color="purple"
                isGlassmorphismEnabled={isGlassmorphismEnabled}
            />

            <div className="md:col-span-2 lg:col-span-2">
                <SentimentDonutChart 
                    data={data.sentimentDistribution} 
                    isGlassmorphismEnabled={isGlassmorphismEnabled}
                    onFilterChange={onFilterChange}
                    activeFilter={filterSentiment}
                />
            </div>
            <div className="md:col-span-2 lg:col-span-2">
                 <ConfidenceBarChart data={results} isGlassmorphismEnabled={isGlassmorphismEnabled} />
            </div>
            
            <div className="lg:col-span-4">
                <RadarChartSummary 
                    data={data}
                    isGlassmorphismEnabled={isGlassmorphismEnabled}
                />
            </div>

            <div className="lg:col-span-4">
                {filterSentiment && (
                    <div className="flex justify-end mb-4">
                        <button 
                            onClick={() => onFilterChange(null)}
                            className="flex items-center text-sm bg-purple-600/50 text-purple-200 hover:bg-purple-500/50 border border-purple-500/80 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                            <FilterX size={16} className="mr-2" />
                            Clear Filter ({filterSentiment})
                        </button>
                    </div>
                )}
                <ResultsTable results={filteredResults} isGlassmorphismEnabled={isGlassmorphismEnabled} />
            </div>
        </div>
    );
};

export default DashboardView;
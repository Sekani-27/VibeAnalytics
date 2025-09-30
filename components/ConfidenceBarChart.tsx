import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { AnalysisResult, Sentiment } from '../types';

interface ConfidenceBarChartProps {
    data: AnalysisResult[];
    isGlassmorphismEnabled: boolean;
}

const COLORS: Record<Sentiment, string> = {
    [Sentiment.POSITIVE]: '#4ade80', // green-400
    [Sentiment.NEGATIVE]: '#f87171', // red-400
    [Sentiment.NEUTRAL]: '#a3a3a3',  // neutral-400
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-md shadow-lg text-sm">
        <p className="label text-white font-bold mb-1">{label}</p>
        <p className="text-gray-300">{`Confidence: ${payload[0].value.toFixed(1)}%`}</p>
        <p className="font-medium" style={{ color: COLORS[dataPoint.sentiment] }}>
            {`Sentiment: ${dataPoint.sentiment}`}
        </p>
      </div>
    );
  }
  return null;
};

const ConfidenceBarChart: React.FC<ConfidenceBarChartProps> = ({ data, isGlassmorphismEnabled }) => {
    const containerClasses = `relative overflow-hidden border rounded-xl p-6 h-full flex flex-col min-h-[350px] transition-colors duration-300 ${isGlassmorphismEnabled ? 'glass-panel' : 'bg-slate-800 border-slate-700'}`;

    const chartData = data.map((item, index) => ({
        ...item,
        name: `Text ${index + 1}`,
        confidence: item.confidence * 100,
    }));
        
    return (
        <div className={containerClasses}>
            <h3 className="text-lg font-semibold text-white mb-4">Recent Confidence Scores</h3>
            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#475569' }} />
                        <YAxis tick={{ fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#475569' }} domain={[0, 100]} />
                        <Tooltip cursor={{fill: 'rgba(124, 58, 237, 0.1)'}} content={<CustomTooltip />} />
                        <Bar dataKey="confidence" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.sentiment]} style={{filter: `drop-shadow(0 0 4px ${COLORS[entry.sentiment]})`}} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ConfidenceBarChart;
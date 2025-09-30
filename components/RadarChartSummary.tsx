import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { DashboardData } from '../types';

interface RadarChartSummaryProps {
    data: DashboardData;
    isGlassmorphismEnabled: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0];
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-md shadow-lg text-sm">
        <p className="font-bold text-white">{`${dataPoint.payload.subject}`}</p>
        <p style={{ color: dataPoint.color }}>{`Score: ${dataPoint.value.toFixed(1)}%`}</p>
      </div>
    );
  }
  return null;
};

const RadarChartSummary: React.FC<RadarChartSummaryProps> = ({ data, isGlassmorphismEnabled }) => {
    const containerClasses = `relative overflow-hidden border rounded-xl p-6 h-full flex flex-col transition-colors duration-300 ${isGlassmorphismEnabled ? 'glass-panel' : 'bg-slate-800 border-slate-700'}`;

    const chartData = [
        { subject: 'Positive', value: data.positivePercentage, fullMark: 100 },
        { subject: 'Negative', value: data.negativePercentage, fullMark: 100 },
        { subject: 'Neutral', value: data.neutralPercentage, fullMark: 100 },
        { subject: 'Avg Confidence', value: data.avgConfidence, fullMark: 100 },
    ];

    return (
        <div className={containerClasses}>
            <h3 className="text-lg font-semibold text-white mb-4">Analysis Snapshot</h3>
            <div className="flex-grow min-h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="#475569" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 14 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8' }} axisLine={false} tickCount={6} />
                        <Radar 
                            name="Analysis" 
                            dataKey="value" 
                            stroke="#c084fc" 
                            fill="#c084fc" 
                            fillOpacity={0.6}
                            style={{filter: 'drop-shadow(0 0 8px #c084fc)'}}
                        />
                        <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RadarChartSummary;
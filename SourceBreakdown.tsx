import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { Card } from "@/components/ui/card";
import { Twitter, Instagram, Facebook, Globe, MessageSquare, Zap } from "lucide-react";
import type { AnalysisResult } from "@/components/Analysis/ResultsDisplay";

interface SourceData {
  name: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const COLORS = [
  'hsl(271, 91%, 65%)',
  'hsl(180, 85%, 50%)',
  'hsl(142, 71%, 45%)',
  'hsl(47, 84%, 60%)',
  'hsl(0, 84%, 60%)',
  'hsl(220, 70%, 50%)',
];

interface SourceBreakdownProps {
  results?: AnalysisResult[];
}

export function SourceBreakdown({ results = [] }: SourceBreakdownProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Calculate source distribution from results
  const sourceMap = results.reduce((acc, result) => {
    // Simple heuristic: detect platform keywords in text
    const text = result.text.toLowerCase();
    let source = 'Other';
    
    if (text.includes('twitter') || text.includes('tweet')) source = 'Twitter';
    else if (text.includes('instagram') || text.includes('insta')) source = 'Instagram';
    else if (text.includes('facebook') || text.includes('fb')) source = 'Facebook';
    else if (text.includes('web') || text.includes('website')) source = 'Web';
    else if (text.includes('forum') || text.includes('reddit')) source = 'Forums';
    
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = results.length || 1;
  const data: SourceData[] = [
    { name: 'Twitter', value: Math.round((sourceMap['Twitter'] || 0) / total * 100), icon: <Twitter className="w-4 h-4" />, color: COLORS[0] },
    { name: 'Instagram', value: Math.round((sourceMap['Instagram'] || 0) / total * 100), icon: <Instagram className="w-4 h-4" />, color: COLORS[1] },
    { name: 'Facebook', value: Math.round((sourceMap['Facebook'] || 0) / total * 100), icon: <Facebook className="w-4 h-4" />, color: COLORS[2] },
    { name: 'Web', value: Math.round((sourceMap['Web'] || 0) / total * 100), icon: <Globe className="w-4 h-4" />, color: COLORS[3] },
    { name: 'Forums', value: Math.round((sourceMap['Forums'] || 0) / total * 100), icon: <MessageSquare className="w-4 h-4" />, color: COLORS[4] },
    { name: 'Other', value: Math.round((sourceMap['Other'] || 0) / total * 100), icon: <Zap className="w-4 h-4" />, color: COLORS[5] },
  ].filter(item => item.value > 0);

  // If no results, show placeholder
  if (results.length === 0) {
    return (
      <Card className="glass-card p-6 animate-fade-in">
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Source Distribution</h3>
          <p className="text-muted-foreground text-sm mt-1">Analytics by platform</p>
        </div>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No data yet. Analyze some text to see source distribution.
        </div>
      </Card>
    );
  }

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          className="transition-all duration-300"
        />
      </g>
    );
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="glass-card p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Source Distribution</h3>
        <p className="text-muted-foreground text-sm mt-1">
          {results.length} {results.length === 1 ? 'analysis' : 'analyses'} across platforms
        </p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            activeIndex={activeIndex !== null ? activeIndex : undefined}
            activeShape={renderActiveShape}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                className="cursor-pointer transition-all duration-300 hover:opacity-80"
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-3 mt-6">
        {data.map((source, index) => (
          <div 
            key={source.name} 
            className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-300 cursor-pointer hover:bg-sidebar-accent ${
              activeIndex === index ? 'bg-sidebar-accent scale-105' : ''
            }`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div 
              className="w-3 h-3 rounded-full transition-all duration-300" 
              style={{ backgroundColor: source.color }}
            />
            <div className="flex items-center gap-1">
              {source.icon}
              <span className="text-sm text-muted-foreground">{source.name}</span>
            </div>
            <span className="text-sm font-medium ml-auto">{source.value}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
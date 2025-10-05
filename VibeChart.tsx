import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VibeChartProps {
  data: Array<{
    time: string;
    positive: number;
    neutral: number;
    negative: number;
  }>;
}

export function VibeChart({ data }: VibeChartProps) {
  const [hiddenLines, setHiddenLines] = useState<Set<string>>(new Set());
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);

  const toggleLine = (dataKey: string) => {
    setHiddenLines(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dataKey)) {
        newSet.delete(dataKey);
      } else {
        newSet.add(dataKey);
      }
      return newSet;
    });
  };

  const isLineVisible = (dataKey: string) => !hiddenLines.has(dataKey);

  return (
    <Card className="glass-card p-6 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Sentiment Timeline</h3>
          <p className="text-muted-foreground text-sm mt-1">Real-time vibe analysis across all channels</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={isLineVisible('positive') ? 'default' : 'outline'}
            onClick={() => toggleLine('positive')}
            className="bg-[hsl(142,71%,45%)] hover:bg-[hsl(142,71%,35%)] text-white"
          >
            Positive
          </Button>
          <Button
            size="sm"
            variant={isLineVisible('neutral') ? 'default' : 'outline'}
            onClick={() => toggleLine('neutral')}
            className="bg-[hsl(47,84%,60%)] hover:bg-[hsl(47,84%,50%)] text-white"
          >
            Neutral
          </Button>
          <Button
            size="sm"
            variant={isLineVisible('negative') ? 'default' : 'outline'}
            onClick={() => toggleLine('negative')}
            className="bg-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,50%)] text-white"
          >
            Negative
          </Button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="neutralGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(47, 84%, 60%)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(47, 84%, 60%)" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend />
          
          {isLineVisible('positive') && (
            <Area
              type="monotone"
              dataKey="positive"
              stroke="hsl(142, 71%, 45%)"
              fillOpacity={hoveredLine === 'positive' || !hoveredLine ? 1 : 0.3}
              fill="url(#positiveGradient)"
              strokeWidth={hoveredLine === 'positive' ? 3 : 2}
              onMouseEnter={() => setHoveredLine('positive')}
              onMouseLeave={() => setHoveredLine(null)}
              animationBegin={0}
              animationDuration={1000}
              animationEasing="ease-in-out"
              className="transition-all duration-300 cursor-pointer"
            />
          )}
          {isLineVisible('neutral') && (
            <Area
              type="monotone"
              dataKey="neutral"
              stroke="hsl(47, 84%, 60%)"
              fillOpacity={hoveredLine === 'neutral' || !hoveredLine ? 1 : 0.3}
              fill="url(#neutralGradient)"
              strokeWidth={hoveredLine === 'neutral' ? 3 : 2}
              onMouseEnter={() => setHoveredLine('neutral')}
              onMouseLeave={() => setHoveredLine(null)}
              animationBegin={200}
              animationDuration={1000}
              animationEasing="ease-in-out"
              className="transition-all duration-300 cursor-pointer"
            />
          )}
          {isLineVisible('negative') && (
            <Area
              type="monotone"
              dataKey="negative"
              stroke="hsl(0, 84%, 60%)"
              fillOpacity={hoveredLine === 'negative' || !hoveredLine ? 1 : 0.3}
              fill="url(#negativeGradient)"
              strokeWidth={hoveredLine === 'negative' ? 3 : 2}
              onMouseEnter={() => setHoveredLine('negative')}
              onMouseLeave={() => setHoveredLine(null)}
              animationBegin={400}
              animationDuration={1000}
              animationEasing="ease-in-out"
              className="transition-all duration-300 cursor-pointer"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
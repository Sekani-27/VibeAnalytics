import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface AnalysisResult {
  text: string;
  sentiment: string;
  score: number;
  label: string;
}

interface ResultsDisplayProps {
  results: AnalysisResult[];
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const getSentimentIcon = (label: string) => {
    const normalized = label.toLowerCase();
    if (normalized.includes('positive')) return <TrendingUp className="w-4 h-4" />;
    if (normalized.includes('negative')) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getSentimentColor = (label: string) => {
    const normalized = label.toLowerCase();
    if (normalized.includes('positive')) return 'text-success';
    if (normalized.includes('negative')) return 'text-danger';
    return 'text-warning';
  };

  const getSentimentBg = (label: string) => {
    const normalized = label.toLowerCase();
    if (normalized.includes('positive')) return 'bg-success/10 border-success/30';
    if (normalized.includes('negative')) return 'bg-danger/10 border-danger/30';
    return 'bg-warning/10 border-warning/30';
  };

  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Analysis Results</h3>
      {results.map((result, index) => (
        <Card key={index} className={`glass-card border ${getSentimentBg(result.label)}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <span className={getSentimentColor(result.label)}>
                  {getSentimentIcon(result.label)}
                </span>
                {result.label}
              </CardTitle>
              <Badge variant="secondary" className="font-mono">
                {(result.score * 100).toFixed(1)}%
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Confidence Score
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={result.score * 100} className="h-2" />
            <div className="p-3 bg-background/50 rounded-md text-sm">
              {result.text}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

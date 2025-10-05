import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SentimentCardProps {
  title: string;
  value: number;
  change: number;
  sentiment: "positive" | "neutral" | "negative";
  percentage: number;
}

export function SentimentCard({ title, value, change, sentiment, percentage }: SentimentCardProps) {
  const sentimentConfig = {
    positive: {
      icon: TrendingUp,
      color: "text-positive",
      bgGradient: "bg-gradient-positive",
    },
    neutral: {
      icon: Minus,
      color: "text-neutral",
      bgGradient: "bg-gradient-card",
    },
    negative: {
      icon: TrendingDown,
      color: "text-negative",
      bgGradient: "bg-gradient-negative",
    },
  };

  const config = sentimentConfig[sentiment];
  const Icon = config.icon;

  return (
    <div className="glass-card rounded-xl p-6 hover:shadow-glow transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2 animate-count">
            {value.toLocaleString()}
          </p>
        </div>
        <div className={cn(
          "p-3 rounded-lg",
          config.bgGradient,
          "opacity-80 group-hover:opacity-100 transition-opacity"
        )}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {change > 0 ? (
            <TrendingUp className="w-4 h-4 text-positive" />
          ) : change < 0 ? (
            <TrendingDown className="w-4 h-4 text-negative" />
          ) : (
            <Minus className="w-4 h-4 text-neutral" />
          )}
          <span className={cn(
            "text-sm font-medium",
            change > 0 ? "text-positive" : change < 0 ? "text-negative" : "text-neutral"
          )}>
            {Math.abs(change)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn("h-full transition-all duration-500", config.bgGradient)}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{percentage}%</span>
        </div>
      </div>
    </div>
  );
}
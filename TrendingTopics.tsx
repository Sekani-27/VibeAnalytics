import { TrendingUp, Hash, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Topic {
  name: string;
  mentions: number;
  sentiment: number; // -100 to 100
  change: number;
}

interface TrendingTopicsProps {
  topics: Topic[];
}

export function TrendingTopics({ topics }: TrendingTopicsProps) {
  return (
    <Card className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">Trending Topics</h3>
          <p className="text-muted-foreground text-sm mt-1">Top conversations right now</p>
        </div>
        <div className="pulse-dot">
          <span className="absolute inline-flex h-2 w-2 rounded-full bg-primary"></span>
        </div>
      </div>

      <div className="space-y-4">
        {topics.map((topic, index) => (
          <div
            key={topic.name}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-card-hover transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Hash className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">{topic.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <MessageCircle className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {topic.mentions.toLocaleString()} mentions
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className={cn(
                  "text-sm font-medium",
                  topic.sentiment > 20 ? "text-positive" :
                  topic.sentiment < -20 ? "text-negative" : "text-neutral"
                )}>
                  {topic.sentiment > 0 ? "+" : ""}{topic.sentiment}%
                </div>
                <div className="flex items-center gap-1 justify-end">
                  {topic.change > 0 ? (
                    <TrendingUp className="w-3 h-3 text-positive" />
                  ) : (
                    <TrendingUp className="w-3 h-3 text-negative rotate-180" />
                  )}
                  <span className={cn(
                    "text-xs",
                    topic.change > 0 ? "text-positive" : "text-negative"
                  )}>
                    {Math.abs(topic.change)}%
                  </span>
                </div>
              </div>
              
              <div className="w-12 h-12 relative">
                <svg className="w-12 h-12 -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="3"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke={
                      topic.sentiment > 20 ? "hsl(142, 71%, 45%)" :
                      topic.sentiment < -20 ? "hsl(0, 84%, 60%)" : "hsl(47, 84%, 60%)"
                    }
                    strokeWidth="3"
                    strokeDasharray={`${Math.abs(topic.sentiment) * 1.26} 126`}
                    className="transition-all duration-500"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                  #{index + 1}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
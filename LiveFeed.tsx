import { Card } from "@/components/ui/card";
import { MessageCircle, Heart, Share2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedItem {
  id: string;
  user: string;
  avatar: string;
  content: string;
  platform: string;
  sentiment: "positive" | "neutral" | "negative";
  timestamp: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}

interface LiveFeedProps {
  items: FeedItem[];
}

export function LiveFeed({ items }: LiveFeedProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "border-l-positive bg-positive/5";
      case "negative": return "border-l-negative bg-negative/5";
      default: return "border-l-neutral bg-neutral/5";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "🎉";
      case "negative": return "😔";
      default: return "💭";
    }
  };

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">Live Sentiment Feed</h3>
          <p className="text-muted-foreground text-sm mt-1">Recent mentions across platforms</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="pulse-dot">
            <span className="absolute inline-flex h-2 w-2 rounded-full bg-primary"></span>
          </div>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "p-4 rounded-lg border-l-4 transition-all hover:shadow-md",
              getSentimentColor(item.sentiment)
            )}
          >
            <div className="flex items-start gap-3">
              <img
                src={item.avatar}
                alt={item.user}
                className="w-10 h-10 rounded-full ring-2 ring-border"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.user}</span>
                    <span className="text-xs text-muted-foreground">@{item.platform}</span>
                    <span className="text-lg">{getSentimentIcon(item.sentiment)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                </div>
                
                <p className="text-sm mb-3 line-clamp-2">{item.content}</p>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Heart className="w-3 h-3" />
                    <span className="text-xs">{item.engagement.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MessageCircle className="w-3 h-3" />
                    <span className="text-xs">{item.engagement.comments}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Share2 className="w-3 h-3" />
                    <span className="text-xs">{item.engagement.shares}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
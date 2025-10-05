import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilterChange: (filter: string | null) => void;
  currentFilter: string | null;
}

export function FilterDialog({ open, onOpenChange, onFilterChange, currentFilter }: FilterDialogProps) {
  const filters = [
    { label: "All", value: null, icon: null },
    { label: "Positive", value: "positive", icon: <TrendingUp className="w-4 h-4" /> },
    { label: "Neutral", value: "neutral", icon: <Minus className="w-4 h-4" /> },
    { label: "Negative", value: "negative", icon: <TrendingDown className="w-4 h-4" /> },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter by Sentiment</DialogTitle>
          <DialogDescription>
            Show only specific sentiment types in your analysis
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {filters.map((filter) => (
            <Button
              key={filter.label}
              variant={currentFilter === filter.value ? "default" : "outline"}
              className="h-16 flex items-center justify-center gap-2"
              onClick={() => {
                onFilterChange(filter.value);
                onOpenChange(false);
              }}
            >
              {filter.icon}
              <span>{filter.label}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

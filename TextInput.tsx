import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TextInputProps {
  onAnalyze: (texts: string[]) => void;
  isAnalyzing: boolean;
}

export function TextInput({ onAnalyze, isAnalyzing }: TextInputProps) {
  const [inputText, setInputText] = useState("");
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt') && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .txt or .csv file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const texts = content.split('\n').filter(line => line.trim());
      onAnalyze(texts);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }
    onAnalyze([inputText]);
  };

  return (
    <Card className="glass-card border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Text Input
        </CardTitle>
        <CardDescription>
          Enter text directly or upload a file for sentiment analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter text to analyze sentiment (e.g., customer review, social media post, feedback...)"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="min-h-[120px] bg-background/50 text-foreground"
        />
        <div className="flex gap-2">
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputText.trim()}
            className="flex-1 bg-gradient-primary hover:opacity-90"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isAnalyzing ? "Analyzing..." : "Analyze Sentiment"}
          </Button>
          <Button
            variant="outline"
            disabled={isAnalyzing}
            className="relative"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload File
            <input
              id="file-upload"
              type="file"
              accept=".txt,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

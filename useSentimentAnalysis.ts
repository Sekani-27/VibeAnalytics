import { useState, useCallback } from "react";
import { pipeline } from "@huggingface/transformers";
import { useToast } from "@/hooks/use-toast";
import type { AnalysisResult } from "@/components/Analysis/ResultsDisplay";

let cachedClassifier: any = null;

export function useSentimentAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const { toast } = useToast();

  const analyze = useCallback(async (texts: string[]) => {
    setIsAnalyzing(true);
    try {
      toast({
        title: "Initializing AI model",
        description: "Loading sentiment analysis model... This may take a moment on first use.",
      });

      // Load the model (cached after first use)
      if (!cachedClassifier) {
        cachedClassifier = await pipeline(
          "sentiment-analysis",
          "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
        );
      }

      toast({
        title: "Analyzing",
        description: `Processing ${texts.length} text(s)...`,
      });

      // Analyze each text
      const analysisPromises = texts.map(async (text) => {
        const result = await cachedClassifier(text);
        return {
          text,
          sentiment: result[0].label,
          score: result[0].score,
          label: result[0].label,
        };
      });

      const analysisResults = await Promise.all(analysisPromises);
      setResults(analysisResults);

      toast({
        title: "Analysis complete",
        description: `Successfully analyzed ${texts.length} text(s)`,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  return { analyze, isAnalyzing, results };
}

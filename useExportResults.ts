import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import type { AnalysisResult } from "@/components/Analysis/ResultsDisplay";

export function useExportResults() {
  const { toast } = useToast();

  const exportToCSV = useCallback((results: AnalysisResult[]) => {
    if (results.length === 0) {
      toast({
        title: "No data to export",
        description: "Please analyze some text first",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Text", "Sentiment", "Confidence Score"];
    const rows = results.map(r => [
      `"${r.text.replace(/"/g, '""')}"`,
      r.label,
      (r.score * 100).toFixed(2) + "%"
    ]);

    const csv = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sentiment-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "CSV file downloaded",
    });
  }, [toast]);

  const exportToJSON = useCallback((results: AnalysisResult[]) => {
    if (results.length === 0) {
      toast({
        title: "No data to export",
        description: "Please analyze some text first",
        variant: "destructive",
      });
      return;
    }

    const data = {
      exported_at: new Date().toISOString(),
      total_analyzed: results.length,
      results: results.map(r => ({
        text: r.text,
        sentiment: r.label,
        confidence_score: r.score,
        percentage: (r.score * 100).toFixed(2) + "%"
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sentiment-analysis-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "JSON file downloaded",
    });
  }, [toast]);

  return { exportToCSV, exportToJSON };
}

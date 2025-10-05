import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileJson, FileSpreadsheet } from "lucide-react";
import type { AnalysisResult } from "@/components/Analysis/ResultsDisplay";
import { useExportResults } from "@/hooks/useExportResults";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: AnalysisResult[];
}

export function ExportDialog({ open, onOpenChange, results }: ExportDialogProps) {
  const { exportToCSV, exportToJSON } = useExportResults();

  const handleExport = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      exportToCSV(results);
    } else {
      exportToJSON(results);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Analysis Results</DialogTitle>
          <DialogDescription>
            Choose a format to export your sentiment analysis results
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button
            variant="outline"
            className="h-24 flex flex-col gap-2"
            onClick={() => handleExport('csv')}
          >
            <FileSpreadsheet className="w-8 h-8" />
            <span>Export as CSV</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col gap-2"
            onClick={() => handleExport('json')}
          >
            <FileJson className="w-8 h-8" />
            <span>Export as JSON</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

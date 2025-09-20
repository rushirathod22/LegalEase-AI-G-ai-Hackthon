import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Save, FileText, File } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ActionButtonsProps {
  content: string;
  documentType: string;
}

export function ActionButtons({ content, documentType }: ActionButtonsProps) {
  const handleDownloadPDF = () => {
    if (!content) {
      toast({
        title: "No content to download",
        description: "Please generate a document first",
        variant: "destructive"
      });
      return;
    }

    // Simulate PDF generation
    toast({
      title: "PDF Download Started",
      description: "Your document is being prepared for download",
    });
    
    // In a real app, this would generate and download an actual PDF
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentType}-document.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadWord = () => {
    if (!content) {
      toast({
        title: "No content to download",
        description: "Please generate a document first",
        variant: "destructive"
      });
      return;
    }

    // Simulate Word document generation
    toast({
      title: "Word Document Download Started",
      description: "Your document is being prepared for download",
    });

    // In a real app, this would generate and download an actual Word document
    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentType}-document.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveDraft = () => {
    if (!content) {
      toast({
        title: "No content to save",
        description: "Please generate a document first",
        variant: "destructive"
      });
      return;
    }

    // Simulate saving to cloud/local storage
    localStorage.setItem(`legalease-draft-${Date.now()}`, JSON.stringify({
      content,
      documentType,
      savedAt: new Date().toISOString()
    }));

    toast({
      title: "Draft Saved Successfully",
      description: "Your document has been saved to your drafts",
    });
  };

  const isDisabled = !content || content.trim().length === 0;

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={handleDownloadPDF}
            disabled={isDisabled}
            variant="outline"
            className="h-12 flex items-center gap-3 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span className="font-medium">Download PDF</span>
          </Button>
          
          <Button
            onClick={handleDownloadWord}
            disabled={isDisabled}
            variant="outline"
            className="h-12 flex items-center gap-3 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <File className="h-4 w-4" />
            <span className="font-medium">Download Word</span>
          </Button>
          
          <Button
            onClick={handleSaveDraft}
            disabled={isDisabled}
            className="h-12 flex items-center gap-3 bg-gradient-to-r from-accent via-primary to-secondary hover:shadow-[var(--shadow-glow)] text-accent-foreground transition-all duration-300 transform hover:scale-[1.02] font-semibold"
          >
            <Save className="h-4 w-4" />
            <span className="font-medium">Save Draft</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
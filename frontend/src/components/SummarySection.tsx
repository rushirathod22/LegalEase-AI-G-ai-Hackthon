import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronRight, FileText, Lightbulb, AlertCircle, Shield } from "lucide-react";

interface SummarySectionProps {
  content: string;
  summary?: string;
}

export function SummarySection({ content, summary }: SummarySectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState(summary || "");
  const [isGenerating, setIsGenerating] = useState(false);

  // const generateSummary = async () => {
  //   if (!content) return;

  //   setIsGenerating(true);

  //   // Simulate AI summary generation
  //   setTimeout(() => {
  //     const mockSummary = {
  //       overview: "This Non-Disclosure Agreement establishes confidentiality obligations between the parties for sharing proprietary information related to a software development project.",
  //       keyPoints: [
  //         "Agreement duration: 2 years from the date of signing",
  //         "Covers technical specifications, customer data, and business processes",
  //         "Mutual obligations - both parties must protect shared information",
  //         "Standard exceptions for publicly available information"
  //       ],
  //       risks: [
  //         "Broad definition of confidential information may include general business knowledge",
  //         "No specific provisions for return of information upon termination"
  //       ],
  //       recommendations: [
  //         "Consider adding specific clauses for digital data handling",
  //         "Include clear procedures for information return or destruction",
  //         "Review liability limitations for unintentional disclosure"
  //       ]
  //     };

  //     setGeneratedSummary(`**Overview:**\n${mockSummary.overview}\n\n**Key Points:**\n${mockSummary.keyPoints.map(point => `• ${point}`).join('\n')}\n\n**Potential Risks:**\n${mockSummary.risks.map(risk => `⚠️ ${risk}`).join('\n')}\n\n**Recommendations:**\n${mockSummary.recommendations.map(rec => `💡 ${rec}`).join('\n')}`);
  //     setIsGenerating(false);
  //     setIsOpen(true);
  //   }, 2000);
  // };


  const generateSummary = async () => {
    if (!content) return;

    setIsGenerating(true);

    try {
      const response = await fetch("http://localhost:5000/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      // Convert object to formatted string
      const summaryObj = data.summary;
      const formatted = `**Overview:**\n${summaryObj.overview || "None"}\n\n` +
        `**Key Points:**\n${(summaryObj.keyPoints || []).map((p: string) => `• ${p}`).join("\n") || "None"}\n\n` +
        `**Potential Risks:**\n${(summaryObj.risks || []).map((r: string) => `⚠️ ${r}`).join("\n") || "None"}\n\n` +
        `**Recommendations:**\n${(summaryObj.recommendations || []).map((rec: string) => `💡 ${rec}`).join("\n") || "None"}`;

      setGeneratedSummary(formatted);
      setIsOpen(true);

    } catch (err) {
      console.error("Error generating summary:", err);
    } finally {
      setIsGenerating(false);
    }
  };


  const formatSummary = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      .replace(/• (.*?)(?=\n|$)/g, '<div class="flex items-start gap-2 mb-1"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div><div>$1</div></div>')
      .replace(/⚠️ (.*?)(?=\n|$)/g, '<div class="flex items-start gap-2 mb-2 text-legal-warning-foreground"><AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-legal-warning" /><div>$1</div></div>')
      .replace(/💡 (.*?)(?=\n|$)/g, '<div class="flex items-start gap-2 mb-2 text-legal-safe-foreground"><Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0 text-legal-safe" /><div>$1</div></div>')
      .replace(/\n/g, '<br />');
  };

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-semibold">Plain Language Summary</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {!generatedSummary && content && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      generateSummary();
                    }}
                    disabled={isGenerating}
                    variant="outline"
                    size="sm"
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {isGenerating ? "Generating..." : "Generate Summary"}
                  </Button>
                )}
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 transition-transform" />
                ) : (
                  <ChevronRight className="h-4 w-4 transition-transform" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent>
            {isGenerating ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center space-y-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground">Analyzing document and generating summary...</p>
                </div>
              </div>
            ) : generatedSummary ? (
              <ScrollArea className="h-64 w-full">
                <div
                  className="prose prose-sm max-w-none text-sm leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{
                    __html: formatSummary(generatedSummary)
                  }}
                />
              </ScrollArea>
            ) : content ? (
              <div className="flex items-center justify-center h-32 border border-dashed border-input/50 rounded-lg">
                <div className="text-center space-y-2">
                  <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Click "Generate Summary" to get a plain-language breakdown</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 border border-dashed border-input/50 rounded-lg">
                <div className="text-center space-y-2">
                  <Shield className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Generate a document first to see its summary</p>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
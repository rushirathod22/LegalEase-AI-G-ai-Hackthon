import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface DraftOutputProps {
  content: string;
  isGenerating: boolean;
}

export function DraftOutput({ content, isGenerating }: DraftOutputProps) {
  const [editableContent, setEditableContent] = useState(content);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditableContent(content);
  }, [content]);

  const highlightLegalTerms = (text: string) => {
    if (!text) return text;

    const riskPatterns = [
      { pattern: /\b(liable|liability|damages|penalty|penalties)\b/gi, level: 'warning' },
      { pattern: /\b(terminate|termination|breach|violation)\b/gi, level: 'warning' },
      { pattern: /\b(indemnify|indemnification|hold harmless)\b/gi, level: 'danger' },
      { pattern: /\b(confidential|proprietary|trade secret)\b/gi, level: 'safe' },
      { pattern: /\b(intellectual property|copyright|trademark|patent)\b/gi, level: 'safe' },
      { pattern: /\b(force majeure|act of god|unforeseeable)\b/gi, level: 'info' },
    ];

    let highlightedText = text;
    
    riskPatterns.forEach(({ pattern, level }) => {
      highlightedText = highlightedText.replace(pattern, (match) => {
        const colorClass = level === 'danger' ? 'bg-destructive/20 text-destructive-foreground' :
                          level === 'warning' ? 'bg-legal-warning/20 text-legal-warning-foreground' :
                          level === 'safe' ? 'bg-legal-safe/20 text-legal-safe-foreground' :
                          'bg-legal-highlight/20 text-legal-highlight-foreground';
        return `<span class="${colorClass} px-1 rounded font-medium">${match}</span>`;
      });
    });

    return highlightedText;
  };

  const getRiskBadges = () => {
    if (!content) return [];
    
    const riskCount = (content.match(/\b(indemnify|indemnification|hold harmless)\b/gi) || []).length;
    const warningCount = (content.match(/\b(liable|liability|damages|penalty|penalties|terminate|termination|breach|violation)\b/gi) || []).length;
    const safeCount = (content.match(/\b(confidential|proprietary|trade secret|intellectual property|copyright|trademark|patent)\b/gi) || []).length;

    const badges = [];
    if (riskCount > 0) {
      badges.push({ icon: AlertTriangle, text: `${riskCount} High Risk`, variant: 'destructive' as const });
    }
    if (warningCount > 0) {
      badges.push({ icon: AlertTriangle, text: `${warningCount} Warnings`, variant: 'secondary' as const });
    }
    if (safeCount > 0) {
      badges.push({ icon: CheckCircle, text: `${safeCount} Protected`, variant: 'default' as const });
    }
    return badges;
  };

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">Document Draft</CardTitle>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {getRiskBadges().map((badge, index) => (
              <Badge key={index} variant={badge.variant} className="flex items-center gap-1">
                <badge.icon className="h-3 w-3" />
                {badge.text}
              </Badge>
            ))}
          </div>
        </div>
        
        {content && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            <span>Click on any text to edit inline. Highlighted terms indicate legal significance.</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {isGenerating ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Generating your legal document...</p>
            </div>
          </div>
        ) : content ? (
          <ScrollArea className="h-96 w-full rounded-md border border-input/50 p-4">
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              className="prose prose-sm max-w-none focus:outline-none leading-relaxed"
              style={{ whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{
                __html: highlightLegalTerms(editableContent)
              }}
              onInput={(e) => setEditableContent(e.currentTarget.textContent || '')}
            />
          </ScrollArea>
        ) : (
          <div className="flex items-center justify-center h-64 border border-dashed border-input/50 rounded-lg">
            <div className="text-center space-y-2">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Your generated document will appear here</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
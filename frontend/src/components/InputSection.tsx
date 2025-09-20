import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Sparkles } from "lucide-react";

interface InputSectionProps {
  onGenerate: (instructions: string, documentType: string) => void;
  isGenerating: boolean;
}

const documentTypes = [
  { value: "nda", label: "Non-Disclosure Agreement (NDA)" },
  { value: "service", label: "Service Agreement" },
  { value: "lease", label: "Lease Agreement" },
  { value: "employment", label: "Employment Contract" },
  { value: "partnership", label: "Partnership Agreement" },
  { value: "licensing", label: "Licensing Agreement" },
];

export function InputSection({ onGenerate, isGenerating }: InputSectionProps) {
  const [instructions, setInstructions] = useState("");
  const [documentType, setDocumentType] = useState("");

  const handleGenerate = () => {
    if (instructions.trim() && documentType) {
      onGenerate(instructions, documentType);
    }
  };

  const isValid = instructions.trim().length > 0 && documentType;

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold">Document Instructions</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Describe your legal document requirements in plain English
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="instructions" className="text-sm font-medium">
            Natural Language Instructions
          </label>
          <Textarea
            id="instructions"
            placeholder="Example: Create an NDA between ABC Pvt Ltd and John Doe for a software development project. The agreement should last for 2 years and include protection for technical specifications and customer data..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="min-h-[120px] resize-none border-input/50 focus:border-ring transition-colors"
            disabled={isGenerating}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="document-type" className="text-sm font-medium">
            Document Type
          </label>
          <Select 
            value={documentType} 
            onValueChange={setDocumentType}
            disabled={isGenerating}
          >
            <SelectTrigger id="document-type" className="border-input/50">
              <SelectValue placeholder="Select a document type" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!isValid || isGenerating}
          className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-[var(--shadow-glow)] transition-all duration-300 shadow-[var(--shadow-elevated)] transform hover:scale-[1.02]"
        >
          {isGenerating ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-spin" />
              Generating Document...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Draft
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
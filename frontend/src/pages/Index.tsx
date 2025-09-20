import { useState } from "react";
import { InputSection } from "@/components/InputSection";
import { DraftOutput } from "@/components/DraftOutput";
import { SummarySection } from "@/components/SummarySection";
import { ActionButtons } from "@/components/ActionButtons";
import { Scale, Sparkles } from "lucide-react";

const Index = () => {
  // const [document, setDocument] = useState("");
  // const [documentType, setDocumentType] = useState("");
  // const [isGenerating, setIsGenerating] = useState(false);
  const [draftContent, setDraftContent] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);


  //   const handleGenerate = async (instructions: string, type: string) => {
  //     setIsGenerating(true);
  //     setDocumentType(type);

  //     // Simulate AI document generation
  //     setTimeout(() => {
  //       const sampleDocument = `NON-DISCLOSURE AGREEMENT

  // This Non-Disclosure Agreement ("Agreement") is entered into on [DATE], between ABC Pvt Ltd, a corporation organized and existing under the laws of [STATE], with its principal place of business at [ADDRESS] ("Disclosing Party"), and John Doe, an individual residing at [ADDRESS] ("Receiving Party").

  // RECITALS

  // WHEREAS, the Disclosing Party possesses certain confidential and proprietary information relating to software development projects, technical specifications, and customer data;

  // WHEREAS, the Receiving Party desires to receive such confidential information for the purpose of evaluating potential business opportunities;

  // NOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

  // 1. DEFINITION OF CONFIDENTIAL INFORMATION

  // For purposes of this Agreement, "Confidential Information" shall include all information, data, materials, products, technology, computer programs, software, marketing plans, customer lists, business plans, financial information, or other subject matter pertaining to any aspects of the business, products, or services of the Disclosing Party.

  // 2. OBLIGATIONS OF RECEIVING PARTY

  // The Receiving Party agrees to:
  // a) Hold and maintain the Confidential Information in strict confidence;
  // b) Not disclose the Confidential Information to any third parties without prior written consent;
  // c) Use the Confidential Information solely for the purpose of evaluating potential business opportunities;
  // d) Take reasonable precautions to protect the confidentiality of such information.

  // 3. TERM AND TERMINATION

  // This Agreement shall commence on the date first written above and shall continue for a period of two (2) years, unless terminated earlier by mutual consent of the parties.

  // 4. LIABILITY AND INDEMNIFICATION

  // The Receiving Party shall indemnify and hold harmless the Disclosing Party from any damages resulting from breach of this Agreement. In no event shall either party be liable for any indirect, special, incidental, or consequential damages.

  // 5. GOVERNING LAW

  // This Agreement shall be governed by and construed in accordance with the laws of [STATE], without regard to its conflict of law principles.

  // IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

  // _________________________        _________________________
  // ABC Pvt Ltd                      John Doe
  // By: [NAME], [TITLE]              Individual
  // Date: _______________            Date: _______________`;

  //       setDocument(sampleDocument);
  //       setIsGenerating(false);
  //     }, 3000);
  //   };

  // Generate Draft
  const handleGenerate = async (instructions: string, type: string) => {
    setIsGenerating(true);
    setDocumentType(type);

    try {
      const response = await fetch("http://localhost:5000/api/generate-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructions, documentType: type }),
      });

      const data = await response.json();
      setDraftContent(data.content);  // ✅ use correct state
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-gradient-to-r from-card/90 via-card to-card/90 backdrop-blur-sm sticky top-0 z-50 shadow-[var(--shadow-card)]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Scale className="h-8 w-8 text-primary animate-pulse" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  LegalEase AI
                </h1>
                <p className="text-sm font-medium text-primary/70">Smart Legal Document Assistant</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2 bg-gradient-to-r from-secondary/20 to-accent/20 px-3 py-1.5 rounded-full border border-secondary/30">
              <Sparkles className="h-4 w-4 text-secondary animate-pulse" />
              <span className="text-sm font-semibold text-secondary">AI-Powered</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-3xl blur-3xl"></div>
            <div className="relative">
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                Draft Legal Documents with
                <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-pulse">
                  AI Precision
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-6">
                <span className="font-semibold text-primary">Transform</span> your natural language instructions into
                <span className="font-semibold text-accent"> professional legal documents</span>.
                Get instant <span className="font-semibold text-secondary">risk analysis</span> and plain-English summaries.
              </p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <InputSection onGenerate={handleGenerate} isGenerating={isGenerating} />
              <SummarySection content={draftContent} />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <DraftOutput content={draftContent} isGenerating={isGenerating} />
              <ActionButtons content={draftContent} documentType={documentType} />
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-border/50 pt-8 mt-16">
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>
                <strong className="text-legal-warning-foreground">Disclaimer:</strong> This is a prototype application.
                Generated documents should be reviewed by qualified legal professionals before use.
              </p>
              <p>
                LegalEase AI - Streamlining legal document creation with artificial intelligence.
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Index;
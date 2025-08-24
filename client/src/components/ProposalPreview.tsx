import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Proposal } from "@shared/schema";
import ReactMarkdown from "react-markdown";

// Import libraries for export functionality
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

interface ProposalPreviewProps {
  proposal?: Proposal;
}

export default function ProposalPreview({ proposal }: ProposalPreviewProps) {
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const exportToPDF = async () => {
    if (!previewRef.current || !proposal) return;
    
    setIsExporting(true);
    try {
      // Wait a moment for any animations or rendering to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        width: previewRef.current.scrollWidth,
        height: previewRef.current.scrollHeight,
      });
      
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${proposal.title || proposal.clientName || 'proposal'}.pdf`);
      
      toast({
        title: "PDF Export Complete",
        description: "Your proposal has been downloaded as PDF with proper formatting",
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export as PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToDOCX = async () => {
    if (!proposal) return;
    
    setIsExporting(true);
    try {
      // Parse markdown content and convert to DOCX with better formatting
      const content = proposal.markdownContent || "";
      const lines = content.split('\n');
      const paragraphs: Paragraph[] = [];

      // Add proposal header
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Client: ${proposal.clientName}`, bold: true }),
            new TextRun({ text: `\nIndustry: ${proposal.industry}` }),
            new TextRun({ text: `\nDate: ${proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString() : 'N/A'}` }),
          ],
          spacing: { after: 300 }
        })
      );

      lines.forEach((line) => {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('# ')) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: trimmedLine.substring(2), bold: true, size: 32 })],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 }
            })
          );
        } else if (trimmedLine.startsWith('## ')) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: trimmedLine.substring(3), bold: true, size: 28 })],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 150 }
            })
          );
        } else if (trimmedLine.startsWith('### ')) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: trimmedLine.substring(4), bold: true, size: 24 })],
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 150, after: 100 }
            })
          );
        } else if (trimmedLine.startsWith('---')) {
          // Add a horizontal line (represented as a line of dashes)
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" })],
              spacing: { before: 150, after: 150 }
            })
          );
        } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
          // Handle bullet points
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: `• ${trimmedLine.substring(2)}` })],
              spacing: { after: 50 }
            })
          );
        } else if (trimmedLine.match(/^\d+\.\s/)) {
          // Handle numbered lists
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: trimmedLine })],
              spacing: { after: 50 }
            })
          );
        } else if (trimmedLine.includes('**') && trimmedLine.includes('**')) {
          // Handle bold text
          const parts = trimmedLine.split('**');
          const textRuns: TextRun[] = [];
          
          parts.forEach((part, index) => {
            if (index % 2 === 0) {
              if (part) textRuns.push(new TextRun({ text: part }));
            } else {
              if (part) textRuns.push(new TextRun({ text: part, bold: true }));
            }
          });
          
          if (textRuns.length > 0) {
            paragraphs.push(
              new Paragraph({
                children: textRuns,
                spacing: { after: 100 }
              })
            );
          }
        } else if (trimmedLine) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: trimmedLine })],
              spacing: { after: 100 }
            })
          );
        } else {
          // Empty line for spacing
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: "" })],
              spacing: { after: 50 }
            })
          );
        }
      });

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${proposal.title || proposal.clientName || 'proposal'}.docx`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "DOCX Export Complete",
        description: "Your proposal has been downloaded as DOCX with proper formatting",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export as DOCX",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Preview Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Preview</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your proposal will appear here as you generate
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={exportToPDF}
                disabled={!proposal || isExporting}
                variant="destructive"
                size="sm"
                data-testid="button-export-pdf"
              >
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button
                onClick={exportToDOCX}
                disabled={!proposal || isExporting}
                className="bg-blue-500 hover:bg-blue-600"
                size="sm"
                data-testid="button-export-docx"
              >
                <Download className="w-4 h-4 mr-2" />
                DOCX
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Markdown Preview */}
      <Card className="h-full">
        <CardContent className="p-8 h-full overflow-y-auto">
          <div ref={previewRef} className="prose prose-slate dark:prose-invert max-w-none" data-testid="proposal-preview">
            {proposal ? (
              <>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-8">
                  <p><strong>Client:</strong> {proposal.clientName}</p>
                  <p><strong>Industry:</strong> {proposal.industry}</p>
                  <p><strong>Date:</strong> {proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <ReactMarkdown>
                    {proposal.markdownContent}
                  </ReactMarkdown>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-600">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Generated by ProposalAI - Professional AI-Powered Proposals
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                  No Proposal Generated
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Fill out the form and click "Generate AI Proposal" to see your proposal here.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

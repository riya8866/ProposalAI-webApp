import { useState } from "react";
import { Link } from "wouter";
import TopNavigation from "@/components/TopNavigation";
import ProposalForm from "@/components/ProposalForm";
import ProposalPreview from "@/components/ProposalPreview";
import ProposalHistory from "@/components/ProposalHistory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, LayoutTemplate, History, MessageCircle } from "lucide-react";
import type { Proposal } from "@shared/schema";

export default function Home() {
  const [currentProposal, setCurrentProposal] = useState<Proposal | undefined>();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleProposalGenerated = (proposal: Proposal) => {
    setCurrentProposal(proposal);
  };

  const handleProposalSelected = (proposal: Proposal) => {
    setCurrentProposal(proposal);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <TopNavigation />
      
      <div className="pt-16 p-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Proposal Generator
                </h1>
                <p className="text-gray-400">Create professional proposals with AI assistance</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild 
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all duration-200"
                  data-testid="button-ai-chat"
                >
                  <Link href="/chat">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    AI Chat
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild 
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all duration-200"
                  data-testid="button-manage-templates"
                >
                  <Link href="/templates">
                    <LayoutTemplate className="w-4 h-4 mr-2" />
                    Templates
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsHistoryOpen(true)}
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all duration-200"
                  data-testid="button-view-history"
                >
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
              </div>
            </div>
          </div>

          {/* Main Layout */}
          <div className="grid lg:grid-cols-5 gap-6 min-h-[600px]">
            {/* Left Pane - Proposal Form */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-y-auto">
              <ProposalForm onProposalGenerated={handleProposalGenerated} />
            </div>

            {/* Right Pane - Proposal Preview */}
            <div className="lg:col-span-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-y-auto">
              <ProposalPreview proposal={currentProposal} />
            </div>
          </div>
        </div>
      </div>

      {/* Proposal History Sidebar */}
      <ProposalHistory 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onProposalSelect={handleProposalSelected}
      />

      {/* History Toggle Button (when panel is closed) */}
      {!isHistoryOpen && (
        <Button
          onClick={() => setIsHistoryOpen(true)}
          className="fixed right-6 bottom-6 w-14 h-14 rounded-2xl shadow-2xl z-20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 transition-all duration-200"
          data-testid="button-toggle-history-fab"
        >
          <History className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
}

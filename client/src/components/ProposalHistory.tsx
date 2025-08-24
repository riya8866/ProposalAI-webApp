import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, History, Eye, Trash2, FileText } from "lucide-react";
import type { Proposal } from "@shared/schema";

interface ProposalHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onProposalSelect?: (proposal: Proposal) => void;
}

export default function ProposalHistory({ isOpen, onClose, onProposalSelect }: ProposalHistoryProps) {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: proposals, isLoading } = useQuery<Proposal[]>({
    queryKey: ["/api/proposals"],
  });

  const deleteProposalMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        if (!id) {
          throw new Error("Proposal ID is required for deletion");
        }
        await apiRequest(`/api/proposals/${id}`, "DELETE");
      } catch (error) {
        console.error("Proposal deletion error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      try {
        toast({
          title: "Proposal Deleted",
          description: "The proposal has been deleted successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
      } catch (error) {
        console.error("Error handling successful proposal deletion:", error);
      }
    },
    onError: (error: Error) => {
      console.error("Proposal deletion failed:", error);
      const errorMessage = error.message || "An unexpected error occurred while deleting the proposal";
      toast({
        title: "Deletion Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">Completed</Badge>;
      case 'sent':
        return <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">Sent</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  const handleView = (proposal: Proposal) => {
    setSelectedProposal(proposal);
  };

  const handleSelect = (proposal: Proposal) => {
    onProposalSelect?.(proposal);
    onClose();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this proposal?")) {
      deleteProposalMutation.mutate(id);
    }
  };

  const formatFileSize = (content: string) => {
    const sizeInBytes = new Blob([content]).size;
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  };

  return (
    <>
      {/* History Panel */}
      <div className={`fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out z-30 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Proposals</h3>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-history">
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : proposals?.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <p className="text-sm text-slate-600 dark:text-slate-400">No proposals yet</p>
              </div>
            ) : (
              proposals?.map((proposal) => (
                <div
                  key={proposal.id}
                  className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  onClick={() => handleSelect(proposal)}
                  data-testid={`proposal-history-item-${proposal.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                      {proposal.title}
                    </h4>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(proposal);
                        }}
                        data-testid={`button-view-proposal-${proposal.id}`}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDelete(proposal.id, e)}
                        data-testid={`button-delete-proposal-${proposal.id}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString() : "Unknown date"}
                  </p>
                  <div className="flex items-center justify-between">
                    {getStatusBadge(proposal.status || 'draft')}
                    <span className="text-xs text-slate-500">
                      {formatFileSize(proposal.markdownContent)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Proposal Detail Modal */}
      <Dialog open={!!selectedProposal} onOpenChange={() => setSelectedProposal(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProposal?.title}</DialogTitle>
          </DialogHeader>
          {selectedProposal && (
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-6 not-prose">
                <p><strong>Client:</strong> {selectedProposal.clientName}</p>
                <p><strong>Industry:</strong> {selectedProposal.industry}</p>
                <p><strong>Created:</strong> {selectedProposal.createdAt ? new Date(selectedProposal.createdAt).toLocaleDateString() : "Unknown date"}</p>
              </div>
              <div className="whitespace-pre-wrap">
                {selectedProposal.markdownContent}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* History Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => {}} // This will be handled by parent component
          className="fixed right-6 bottom-6 w-12 h-12 rounded-full shadow-lg z-20"
          data-testid="button-toggle-history"
        >
          <History className="w-5 h-5" />
        </Button>
      )}
    </>
  );
}

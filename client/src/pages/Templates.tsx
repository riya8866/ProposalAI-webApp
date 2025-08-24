import { Link } from "wouter";
import TopNavigation from "@/components/TopNavigation";
import TemplateManager from "@/components/TemplateManager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Templates() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <TopNavigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        <div className="mb-6">
          <Button variant="ghost" asChild data-testid="button-back-home">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Proposals
            </Link>
          </Button>
        </div>
        
        <TemplateManager />
      </div>
    </div>
  );
}

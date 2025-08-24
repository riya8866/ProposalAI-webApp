import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Sparkles, FileText, Shield, Zap, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent-500/10" />
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Bot className="text-white w-10 h-10" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Proposal<span className="bg-gradient-to-r from-primary to-accent-500 bg-clip-text text-transparent">AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Generate professional, AI-powered proposals in minutes. Perfect for consultants, analysts, and business professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent-500 hover:from-primary/90 hover:to-accent-600 text-lg px-8 py-3"
                asChild
                data-testid="button-get-started"
              >
                <a href="/api/login">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started Free
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-3 border-2"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Why Choose ProposalAI?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Streamline your proposal creation process with cutting-edge AI technology and professional templates.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Zap className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Lightning Fast
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Generate comprehensive proposals in minutes, not hours. Our AI understands your requirements and creates professional content instantly.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <FileText className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Professional Templates
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Choose from industry-specific templates or create your own. Every proposal is tailored to your client's needs and your brand.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Shield className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Secure & Reliable
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Your data is protected with enterprise-grade security. Role-based access ensures the right people see the right information.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Roles Section */}
      <div className="bg-white dark:bg-slate-800/50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Built for Every Role
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Whether you're an analyst, consultant, or product manager, ProposalAI adapts to your workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8">
                <Users className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Analysts
                </h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-2">
                  <li>• Create and manage templates</li>
                  <li>• Generate client proposals</li>
                  <li>• Export to PDF and DOCX</li>
                  <li>• Track proposal history</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <FileText className="w-12 h-12 text-emerald-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Consultants
                </h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-2">
                  <li>• Access assigned proposals</li>
                  <li>• Review and collaborate</li>
                  <li>• Use shared templates</li>
                  <li>• Client-focused workflows</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <Shield className="w-12 h-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Product Managers
                </h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-2">
                  <li>• Manage all proposals</li>
                  <li>• Oversee team templates</li>
                  <li>• Analytics and insights</li>
                  <li>• Administrative controls</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Ready to Transform Your Proposals?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust ProposalAI for their most important client communications.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-accent-500 hover:from-primary/90 hover:to-accent-600 text-lg px-8 py-3"
            asChild
            data-testid="button-start-creating"
          >
            <a href="/api/login">
              Start Creating Proposals
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

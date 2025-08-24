import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Moon, Sun, User, ChevronDown, Bot } from "lucide-react";
import type { User as UserType } from "@shared/schema";

export default function TopNavigation() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Type guard for user
  const typedUser = user as UserType | undefined;

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'product_manager':
        return 'default';
      case 'analyst':
        return 'secondary';
      case 'consultant':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'product_manager':
        return 'Product Manager';
      case 'analyst':
        return 'Analyst';
      case 'consultant':
        return 'Consultant';
      default:
        return role;
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and App Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Bot className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-white">ProposalAI</h1>
          </div>

          {/* User Controls */}
          <div className="flex items-center space-x-4">
            {/* Role Badge */}
            {typedUser && (
              <div className="hidden sm:flex items-center px-3 py-1.5 bg-white/10 rounded-lg">
                <User className="w-3 h-3 mr-2 text-white/70" />
                <span className="text-sm text-white font-medium">
                  {getRoleLabel(typedUser.role || 'analyst')}
                </span>
              </div>
            )}

            {/* User Menu */}
            {typedUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 transition-all duration-200" 
                    data-testid="user-menu-trigger"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={typedUser.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {typedUser.firstName?.charAt(0) || typedUser.username?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-white">
                        {typedUser.firstName && typedUser.lastName 
                          ? `${typedUser.firstName} ${typedUser.lastName}`
                          : typedUser.username}
                      </div>
                      {typedUser.email && (
                        <div className="text-xs text-white/70">
                          {typedUser.email}
                        </div>
                      )}
                    </div>
                    <ChevronDown className="w-3 h-3 text-white/70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 rounded-xl">
                  <DropdownMenuItem asChild className="hover:bg-slate-700">
                    <a href="/api/logout" data-testid="logout-link" className="text-white">
                      Logout
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, FileText, Users, TrendingUp } from "lucide-react";
import { LoginData, RegisterData } from "@shared/schema";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [loginData, setLoginData] = useState<LoginData>({
    username: "",
    password: "",
  });
  
  const [registerData, setRegisterData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "analyst",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterData) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Account created!",
        description: "Welcome to ProposalAI. You can now start creating proposals.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <div className="min-h-screen flex">
        {/* Left side - Authentication Forms */}
        <div className="w-1/2 flex items-center justify-center p-12">
          <div className="w-full max-w-lg">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">ProposalAI</h1>
              <p className="text-gray-400 text-lg">AI-powered business proposal generator</p>
            </div>

            {/* Auth Forms */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/10 border-0 h-12 rounded-2xl p-1 mb-8">
                  <TabsTrigger 
                    value="login" 
                    className="text-gray-300 data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-xl transition-all duration-200"
                    data-testid="tab-login"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register" 
                    className="text-gray-300 data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-xl transition-all duration-200"
                    data-testid="tab-register"
                  >
                    Register
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-0">
                  <div className="min-h-[280px]">
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="login-username" className="text-gray-200 text-sm font-medium">Username</Label>
                        <Input
                          id="login-username"
                          type="text"
                          placeholder="Enter your username"
                          value={loginData.username}
                          onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                          required
                          className="h-12 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/15 rounded-xl transition-all duration-200"
                          data-testid="input-username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password" className="text-gray-200 text-sm font-medium">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          required
                          className="h-12 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/15 rounded-xl transition-all duration-200"
                          data-testid="input-password"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200 shadow-lg"
                        disabled={loginMutation.isPending}
                        data-testid="button-login"
                      >
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </form>
                  </div>
                </TabsContent>

                <TabsContent value="register" className="space-y-0">
                  <div className="min-h-[400px]">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="register-firstName" className="text-gray-200 text-sm font-medium">First Name</Label>
                          <Input
                            id="register-firstName"
                            type="text"
                            placeholder="John"
                            value={registerData.firstName || ""}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                            className="h-12 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/15 rounded-xl transition-all duration-200"
                            data-testid="input-firstName"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-lastName" className="text-gray-200 text-sm font-medium">Last Name</Label>
                          <Input
                            id="register-lastName"
                            type="text"
                            placeholder="Doe"
                            value={registerData.lastName || ""}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                            className="h-12 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/15 rounded-xl transition-all duration-200"
                            data-testid="input-lastName"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-username" className="text-gray-200 text-sm font-medium">Username *</Label>
                        <Input
                          id="register-username"
                          type="text"
                          placeholder="Choose a username"
                          value={registerData.username}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                          required
                          className="h-12 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/15 rounded-xl transition-all duration-200"
                          data-testid="input-register-username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email" className="text-gray-200 text-sm font-medium">Email</Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="john@example.com"
                          value={registerData.email || ""}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                          className="h-12 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/15 rounded-xl transition-all duration-200"
                          data-testid="input-email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password" className="text-gray-200 text-sm font-medium">Password *</Label>
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="Choose a secure password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                          required
                          className="h-12 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/15 rounded-xl transition-all duration-200"
                          data-testid="input-register-password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-role" className="text-gray-200 text-sm font-medium">Role</Label>
                        <Select 
                          value={registerData.role} 
                          onValueChange={(value: "analyst" | "consultant" | "product_manager") => 
                            setRegisterData(prev => ({ ...prev, role: value }))
                          }
                        >
                          <SelectTrigger 
                            className="h-12 bg-white/10 border-white/20 text-white focus:border-blue-400 focus:bg-white/15 rounded-xl"
                            data-testid="select-role"
                          >
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700 rounded-xl">
                            <SelectItem value="analyst" className="focus:bg-slate-700" data-testid="role-analyst">
                              Analyst
                            </SelectItem>
                            <SelectItem value="consultant" className="focus:bg-slate-700" data-testid="role-consultant">
                              Consultant
                            </SelectItem>
                            <SelectItem value="product_manager" className="focus:bg-slate-700" data-testid="role-product_manager">
                              Product Manager
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-medium transition-all duration-200 shadow-lg"
                        disabled={registerMutation.isPending}
                        data-testid="button-register"
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Right side - Hero Section */}
        <div className="w-1/2 flex items-center justify-center p-12 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
          <div className="max-w-lg text-center space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl font-bold text-white leading-tight">
                Professional Proposals 
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Made Easy</span>
              </h2>
              <p className="text-gray-300 text-xl leading-relaxed">
                Generate high-quality business proposals using AI-powered templates and 
                intelligent content generation
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center space-x-6 text-left">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold mb-2">Smart Templates</h3>
                  <p className="text-gray-400">
                    Customizable templates for every industry and use case
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-left">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold mb-2">AI-Powered Generation</h3>
                  <p className="text-gray-400">
                    Generate compelling content with Google Gemini AI
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-left">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold mb-2">Team Collaboration</h3>
                  <p className="text-gray-400">
                    Role-based access for teams and organizations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
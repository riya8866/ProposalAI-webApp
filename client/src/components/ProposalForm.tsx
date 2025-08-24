import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Sparkles, Loader2, DollarSign, Calendar } from "lucide-react";
import type { Template, Proposal } from "@shared/schema";

const proposalFormSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  industry: z.string().min(1, "Industry is required"),
  services: z.array(z.string()).min(1, "At least one service is required"),
  objectives: z.string().min(10, "Objectives must be at least 10 characters"),
  scope: z.string().optional(),
  timeline: z.number().min(1, "Timeline is required"),
  budget: z.number().min(10000, "Budget must be at least $10,000"),
  tone: z.string().default("professional"),
  templateId: z.string().optional(),
});

type ProposalFormData = z.infer<typeof proposalFormSchema>;

const serviceOptions = [
  "Strategy Development",
  "Implementation",
  "Training",
  "Ongoing Support",
  "Analysis & Research",
  "Change Management",
];

const toneOptions = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "technical", label: "Technical" },
];

interface ProposalFormProps {
  onProposalGenerated?: (proposal: Proposal) => void;
}

export default function ProposalForm({ onProposalGenerated }: ProposalFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("none");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ProposalFormData>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      clientName: "",
      industry: "Technology",
      services: [],
      objectives: "",
      scope: "",
      timeline: 3,
      budget: 75000,
      tone: "professional",
      templateId: "",
    },
  });

  const { data: templates } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const generateProposalMutation = useMutation({
    mutationFn: async (data: ProposalFormData) => {
      try {
        const response = await apiRequest("POST", "/api/proposals/generate", data);
        const result = await response.json();
        if (!result) {
          throw new Error("No proposal data received from server");
        }
        return result;
      } catch (error) {
        console.error("Proposal generation error:", error);
        throw error;
      }
    },
    onSuccess: (proposal: Proposal) => {
      try {
        toast({
          title: "Proposal Generated Successfully",
          description: "Your AI-powered proposal is ready for review",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
        onProposalGenerated?.(proposal);
      } catch (error) {
        console.error("Error handling successful proposal generation:", error);
      }
    },
    onError: (error: Error) => {
      console.error("Proposal generation failed:", error);
      const errorMessage = error.message || "An unexpected error occurred while generating the proposal";
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ProposalFormData) => {
    generateProposalMutation.mutate({
      ...data,
      timeline: `${data.timeline} months`,
      budget: `$${data.budget.toLocaleString()}`,
      templateId: selectedTemplate === "none" ? undefined : selectedTemplate,
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Generate Proposal</h2>
            <p className="text-sm text-gray-400">Create AI-powered business proposals</p>
          </div>
        </div>
      </div>
      
      {/* Form Content */}
      <div className="flex-1 overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Template Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-200">
                Template (Optional)
              </label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger 
                  className="bg-white/5 border-white/20 text-white focus:border-blue-400 rounded-lg"
                  data-testid="select-template"
                >
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 rounded-lg">
                  <SelectItem value="none" className="focus:bg-slate-700">No Template</SelectItem>
                  {templates?.map((template) => (
                    <SelectItem key={template.id} value={template.id} className="focus:bg-slate-700">
                      {template.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Client Information */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Client Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Acme Corporation" 
                        {...field} 
                        className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 rounded-lg"
                        data-testid="input-client-name" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Industry</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger 
                          className="bg-white/5 border-white/20 text-white focus:border-blue-400 rounded-lg"
                          data-testid="select-industry"
                        >
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700 rounded-lg">
                        <SelectItem value="Technology" className="focus:bg-slate-700">Technology</SelectItem>
                        <SelectItem value="Healthcare" className="focus:bg-slate-700">Healthcare</SelectItem>
                        <SelectItem value="Finance" className="focus:bg-slate-700">Finance</SelectItem>
                        <SelectItem value="Manufacturing" className="focus:bg-slate-700">Manufacturing</SelectItem>
                        <SelectItem value="Retail" className="focus:bg-slate-700">Retail</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Services */}
            <FormField
              control={form.control}
              name="services"
              render={() => (
                <FormItem>
                  <FormLabel className="text-gray-200">Services Required</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {serviceOptions.map((service) => (
                      <FormField
                        key={service}
                        control={form.control}
                        name="services"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={service}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(service)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, service])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== service
                                          )
                                        );
                                  }}
                                  className="border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                  data-testid={`checkbox-service-${service}`}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal text-gray-300">
                                {service}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Objectives */}
            <FormField
              control={form.control}
              name="objectives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Project Objectives</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the main objectives and goals..."
                      className="resize-none bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 rounded-lg"
                      rows={3}
                      {...field}
                      data-testid="textarea-objectives"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project Timeline Slider */}
            <FormField
              control={form.control}
              name="timeline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200 flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Project Timeline: {field.value} months</span>
                  </FormLabel>
                  <FormControl>
                    <div className="px-3">
                      <Slider
                        min={1}
                        max={24}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                        data-testid="slider-timeline"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>1 month</span>
                        <span>6 months</span>
                        <span>12 months</span>
                        <span>24 months</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Budget Slider */}
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200 flex items-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Budget: ${field.value.toLocaleString()}</span>
                  </FormLabel>
                  <FormControl>
                    <div className="px-3">
                      <Slider
                        min={10000}
                        max={1000000}
                        step={5000}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                        data-testid="slider-budget"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>$10K</span>
                        <span>$100K</span>
                        <span>$500K</span>
                        <span>$1M+</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tone Selection */}
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Proposal Tone</FormLabel>
                  <div className="flex space-x-2">
                    {toneOptions.map((tone) => (
                      <Button
                        key={tone.value}
                        type="button"
                        variant={field.value === tone.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(tone.value)}
                        className={field.value === tone.value 
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-white/5 border-white/20 text-gray-300 hover:bg-white/10"
                        }
                        data-testid={`button-tone-${tone.value}`}
                      >
                        {tone.label}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Generate Button */}
            <Button
              type="submit"
              disabled={generateProposalMutation.isPending}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg"
              data-testid="button-generate-proposal"
            >
              {generateProposalMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI Proposal
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

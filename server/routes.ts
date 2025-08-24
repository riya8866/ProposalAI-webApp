import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./localAuth";
import { generateProposal, enhanceTemplate, chatWithGemini } from "./gemini";
import { insertTemplateSchema, insertProposalSchema } from "@shared/schema";
import { z } from "zod";

const generateProposalSchema = z.object({
  clientName: z.string().min(1),
  industry: z.string().min(1),
  services: z.array(z.string()),
  objectives: z.string().min(1),
  scope: z.string().optional(),
  timeline: z.string().min(1),
  budget: z.string().min(1),
  tone: z.string().default("professional"),
  templateId: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  setupAuth(app);

  // Auth route handled in localAuth.ts

  // Template routes
  app.get('/api/templates', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const templates = await storage.getTemplates(userId, user.role);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get('/api/templates/:id', isAuthenticated, async (req: any, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  app.post('/api/templates', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const templateData = insertTemplateSchema.parse({
        ...req.body,
        createdBy: userId,
      });
      
      const template = await storage.createTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating template:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid template data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  app.put('/api/templates/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const template = await storage.getTemplate(req.params.id);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      if (template.createdBy !== userId) {
        return res.status(403).json({ message: "Not authorized to update this template" });
      }
      
      const updateData = insertTemplateSchema.partial().parse(req.body);
      const updatedTemplate = await storage.updateTemplate(req.params.id, updateData);
      res.json(updatedTemplate);
    } catch (error) {
      console.error("Error updating template:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid template data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  app.delete('/api/templates/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const deleted = await storage.deleteTemplate(req.params.id, userId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Template not found or not authorized" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  // Proposal routes
  app.get('/api/proposals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const proposals = await storage.getProposals(userId, user.role);
      res.json(proposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });

  app.get('/api/proposals/:id', isAuthenticated, async (req: any, res) => {
    try {
      const proposal = await storage.getProposal(req.params.id);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      res.json(proposal);
    } catch (error) {
      console.error("Error fetching proposal:", error);
      res.status(500).json({ message: "Failed to fetch proposal" });
    }
  });

  app.post('/api/proposals/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const inputData = generateProposalSchema.parse(req.body);
      
      let templateContent = "";
      if (inputData.templateId) {
        const template = await storage.getTemplate(inputData.templateId);
        if (template) {
          templateContent = await enhanceTemplate(template.content, {
            clientName: inputData.clientName,
            industry: inputData.industry,
            services: inputData.services.join(", "),
            objectives: inputData.objectives,
            timeline: inputData.timeline,
            budget: inputData.budget,
          });
        }
      }
      
      const markdownContent = await generateProposal({
        ...inputData,
        templateContent,
      });
      
      const proposalData = insertProposalSchema.parse({
        title: `${inputData.clientName} - ${inputData.industry} Proposal`,
        markdownContent,
        createdBy: userId,
        ...inputData,
      });
      
      const proposal = await storage.createProposal(proposalData);
      res.status(201).json(proposal);
    } catch (error) {
      console.error("Error generating proposal:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid proposal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to generate proposal" });
    }
  });

  app.put('/api/proposals/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const proposal = await storage.getProposal(req.params.id);
      
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      if (proposal.createdBy !== userId) {
        return res.status(403).json({ message: "Not authorized to update this proposal" });
      }
      
      const updateData = insertProposalSchema.partial().parse(req.body);
      const updatedProposal = await storage.updateProposal(req.params.id, updateData);
      res.json(updatedProposal);
    } catch (error) {
      console.error("Error updating proposal:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid proposal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update proposal" });
    }
  });

  app.delete('/api/proposals/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const deleted = await storage.deleteProposal(req.params.id, userId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Proposal not found or not authorized" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting proposal:", error);
      res.status(500).json({ message: "Failed to delete proposal" });
    }
  });

  // Chat routes
  app.post('/api/chat', isAuthenticated, async (req: any, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        console.error("Invalid message received:", message);
        return res.status(400).json({ message: "Valid message is required" });
      }
      
      if (message.length > 10000) {
        console.error("Message too long:", message.length);
        return res.status(400).json({ message: "Message is too long (max 10,000 characters)" });
      }
      
      const response = await chatWithGemini(message.trim());
      
      if (!response) {
        console.error("Empty response from Gemini");
        return res.status(500).json({ message: "AI service returned empty response" });
      }
      
      res.json({ response });
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ message: `Chat service failed: ${errorMessage}` });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

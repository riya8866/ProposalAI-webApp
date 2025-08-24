import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || ""
});

export interface ProposalInput {
  clientName: string;
  industry: string;
  services: string[];
  objectives: string;
  scope?: string;
  timeline: string;
  budget: string;
  tone: string;
  templateContent?: string;
}

export async function generateProposal(input: ProposalInput): Promise<string> {
  try {
    const systemPrompt = `You are a professional proposal writer with expertise in business consulting. 
Generate a comprehensive, well-structured proposal in Markdown format based on the provided information.

Guidelines:
- Use professional language matching the specified tone
- Include all sections: Executive Summary, Proposed Services, Project Objectives, Timeline & Investment, Next Steps
- Ensure the proposal is compelling and client-focused
- Format using proper Markdown headers and structure
- Keep it concise but comprehensive (800-1200 words)
- Include specific details from the input provided

Template to enhance (if provided): ${input.templateContent || "Create a standard business proposal structure"}

Tone: ${input.tone}`;

    const userPrompt = `Create a proposal for:
Client: ${input.clientName}
Industry: ${input.industry}
Services: ${input.services.join(", ")}
Objectives: ${input.objectives}
${input.scope ? `Scope: ${input.scope}` : ""}
Timeline: ${input.timeline}
Budget: ${input.budget}

Generate a professional proposal that addresses these specific requirements.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: userPrompt,
    });

    return response.text || "Failed to generate proposal content.";
  } catch (error) {
    console.error("Error generating proposal:", error);
    throw new Error(`Failed to generate proposal: ${error}`);
  }
}

export async function enhanceTemplate(templateContent: string, variables: Record<string, string>): Promise<string> {
  try {
    let enhancedContent = templateContent;
    
    // Replace placeholders with actual values
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      enhancedContent = enhancedContent.replace(placeholder, value);
    });

    return enhancedContent;
  } catch (error) {
    console.error("Error enhancing template:", error);
    throw new Error(`Failed to enhance template: ${error}`);
  }
}

export async function chatWithGemini(message: string): Promise<string> {
  try {
    const systemPrompt = `You are a professional business proposal assistant. 
Help users with:
- Business proposal writing and advice
- Industry-specific guidance  
- Template suggestions
- Professional communication tips
- Project scoping and planning

Be helpful, professional, and provide actionable advice. Keep responses concise but informative.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: message,
    });

    return response.text || "I'm having trouble responding right now. Please try again.";
  } catch (error) {
    console.error("Error in chat with Gemini:", error);
    throw new Error(`Failed to get chat response: ${error}`);
  }
}

import {
  users,
  templates,
  proposals,
  type User,
  type UpsertUser,
  type InsertUser,
  type Template,
  type InsertTemplate,
  type Proposal,
  type InsertProposal,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (for local auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Template operations
  getTemplates(userId: string, userRole: string): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: string, template: Partial<InsertTemplate>): Promise<Template>;
  deleteTemplate(id: string, userId: string): Promise<boolean>;

  // Proposal operations
  getProposals(userId: string, userRole: string): Promise<Proposal[]>;
  getProposal(id: string): Promise<Proposal | undefined>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposal(id: string, proposal: Partial<InsertProposal>): Promise<Proposal>;
  deleteProposal(id: string, userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Template operations
  async getTemplates(userId: string, userRole: string): Promise<Template[]> {
    if (userRole === "product_manager") {
      // Product managers can see all templates
      return await db.select().from(templates).orderBy(desc(templates.createdAt));
    } else {
      // Others can see their own templates and public templates
      return await db
        .select()
        .from(templates)
        .where(
          or(
            eq(templates.createdBy, userId),
            eq(templates.isPublic, true)
          )
        )
        .orderBy(desc(templates.createdAt));
    }
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template;
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const [newTemplate] = await db
      .insert(templates)
      .values(template)
      .returning();
    return newTemplate;
  }

  async updateTemplate(id: string, template: Partial<InsertTemplate>): Promise<Template> {
    const [updatedTemplate] = await db
      .update(templates)
      .set({ ...template, updatedAt: new Date() })
      .where(eq(templates.id, id))
      .returning();
    return updatedTemplate;
  }

  async deleteTemplate(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(templates)
      .where(
        and(
          eq(templates.id, id),
          eq(templates.createdBy, userId)
        )
      );
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Proposal operations
  async getProposals(userId: string, userRole: string): Promise<Proposal[]> {
    if (userRole === "product_manager") {
      // Product managers can see all proposals
      return await db.select().from(proposals).orderBy(desc(proposals.createdAt));
    } else {
      // Others can see only their own proposals
      return await db
        .select()
        .from(proposals)
        .where(eq(proposals.createdBy, userId))
        .orderBy(desc(proposals.createdAt));
    }
  }

  async getProposal(id: string): Promise<Proposal | undefined> {
    const [proposal] = await db.select().from(proposals).where(eq(proposals.id, id));
    return proposal;
  }

  async createProposal(proposal: InsertProposal): Promise<Proposal> {
    try {
      const proposalData = {
        ...proposal,
        services: proposal.services || [],
      };
      
      const [newProposal] = await db
        .insert(proposals)
        .values([proposalData])
        .returning();
      if (!newProposal) {
        throw new Error("Failed to create proposal - no data returned");
      }
      return newProposal;
    } catch (error) {
      console.error("Error creating proposal:", error);
      throw new Error(`Failed to create proposal: ${error}`);
    }
  }

  async updateProposal(id: string, proposal: Partial<InsertProposal>): Promise<Proposal> {
    try {
      const updateData: any = {
        ...proposal,
        updatedAt: new Date()
      };
      
      // Ensure services is properly formatted
      if (updateData.services) {
        updateData.services = Array.isArray(updateData.services) ? updateData.services : [];
      }
      
      const [updatedProposal] = await db
        .update(proposals)
        .set(updateData)
        .where(eq(proposals.id, id))
        .returning();
        
      if (!updatedProposal) {
        throw new Error("Proposal not found or could not be updated");
      }
      return updatedProposal;
    } catch (error) {
      console.error("Error updating proposal:", error);
      throw new Error(`Failed to update proposal: ${error}`);
    }
  }

  async deleteProposal(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(proposals)
      .where(
        and(
          eq(proposals.id, id),
          eq(proposals.createdBy, userId)
        )
      );
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const storage = new DatabaseStorage();

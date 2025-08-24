# ProposalAI

A powerful AI-driven business proposal generator that helps professionals create compelling proposals in minutes, not hours. Built with React, Express, PostgreSQL, and Google's Gemini AI API.

## Overview

ProposalAI is a comprehensive web application designed for consultants, analysts, and business professionals who need to generate professional proposals quickly and efficiently. The platform combines customizable templates with Google's Gemini AI to create tailored, high-quality business proposals.

## Key Features

### 🚀 AI-Powered Generation
- **Google Gemini Integration**: Leverage advanced AI to generate compelling proposal content
- **Intelligent Content Creation**: AI understands context and creates professional, industry-specific proposals
- **Multiple Tone Options**: Professional, casual, or persuasive writing styles

### 📋 Template Management
- **Pre-built Templates**: Ready-to-use templates for various industries and proposal types
- **Custom Templates**: Create and manage your own reusable proposal templates
- **Dynamic Placeholders**: Smart variable replacement for personalized proposals
- **Role-based Access**: Templates shared based on user permissions

### 👥 Multi-Role Support
- **Analyst**: Full access to create templates, generate proposals, and manage content
- **Consultant**: Access to assigned proposals and shared templates
- **Product Manager**: Administrative oversight and team management

### 📄 Export Capabilities
- **PDF Export**: Generate professional PDF documents ready for client presentation
- **DOCX Export**: Create Microsoft Word documents for further editing
- **Client-side Processing**: Fast, secure export without server dependencies

### 🔐 Security & Authentication
- **Role-based Authorization**: Granular permissions based on user roles
- **Session Management**: Persistent sessions with PostgreSQL storage

### 💬 AI Chat Assistant
- **Business Guidance**: Get advice on proposal writing and business strategy
- **Industry Insights**: Industry-specific recommendations and best practices
- **Template Suggestions**: AI-powered recommendations for template improvements

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Hook Form** with Zod validation
- **TanStack Query** for server state management

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** with Neon serverless
- **Express Sessions** for authentication

### AI & Services
- **Google Gemini 2.5 Flash** for AI content generation
- **Replit Auth** for authentication
- **html2canvas + jsPDF** for PDF export
- **docx library** for Word document generation

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Access to Google Gemini API

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd proposal-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Set up your environment variables in Replit Secrets:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `SESSION_SECRET`: A secure random string for session encryption

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open your browser and navigate to the provided Replit URL or `http://localhost:5000`

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## Usage Guide

### Creating Your First Proposal

1. **Login** using your Replit account
2. **Select a Template** from the pre-built options or create your own
3. **Fill in Details**: Client name, industry, services, objectives, timeline, and budget
4. **Generate Proposal**: Click "Generate AI Proposal" to create your content
5. **Review & Export**: Review the generated proposal and export as PDF or DOCX

### Managing Templates

1. Navigate to **Templates** page
2. **Create New Template**: Use markdown with placeholders like `{{clientName}}`
3. **Edit Existing**: Modify templates to fit your needs
4. **Share Templates**: Templates are automatically shared based on user roles

### Using AI Chat

1. Access the **AI Chat** feature from any page
2. Ask questions about proposal writing, industry practices, or get template suggestions
3. Receive professional guidance and actionable advice

## Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── contexts/       # React contexts
├── server/                 # Express.js backend
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Database operations
│   ├── gemini.ts           # AI integration
│   └── localAuth.ts        # Authentication setup
├── shared/                 # Shared TypeScript schemas
└── README.md
```

## API Endpoints

- `GET /api/user` - Get current user information
- `GET /api/templates` - Fetch user templates
- `POST /api/templates` - Create new template
- `GET /api/proposals` - Fetch user proposals
- `POST /api/proposals/generate` - Generate new proposal
- `POST /api/chat` - AI chat interaction


## Overview

ProposalAI is an AI-powered business proposal generator web application that allows users to create professional proposals using customizable templates and Google's Gemini AI. The application supports multiple user roles (analyst, consultant, product_manager) and provides comprehensive proposal management features including template creation, AI-powered proposal generation, and export capabilities to PDF and DOCX formats.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom theming support (light/dark modes)
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Authentication**: Cookie-based session management with Replit Auth integration

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ESM modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with role-based access control
- **Session Management**: Express sessions with PostgreSQL storage
- **File Structure**: Monorepo structure with shared schema between client and server

### Data Storage
- **Primary Database**: PostgreSQL with Neon serverless connection
- **Schema Management**: Drizzle Kit for migrations and schema synchronization
- **Session Storage**: PostgreSQL sessions table for authentication persistence
- **Data Models**: Users, Templates, Proposals with relational structure
- **Role-based Access**: Hierarchical permissions (analyst < consultant < product_manager)

### Authentication & Authorization
- **Authentication Provider**: Replit OpenID Connect (OIDC)
- **Session Management**: Express sessions with PostgreSQL store
- **Authorization**: Role-based access control with middleware protection
- **User Management**: Automatic user creation/update from OIDC claims

### AI Integration
- **AI Provider**: Google Gemini 2.5 Flash model
- **Use Cases**: Template enhancement and professional proposal generation
- **Input Processing**: Structured prompts with user context and template content
- **Response Handling**: Markdown-formatted professional proposals

### Export Functionality
- **PDF Export**: html2canvas for DOM rendering + jsPDF for PDF generation
- **DOCX Export**: docx library for Microsoft Word document creation
- **Client-side Processing**: Browser-based export without server dependencies

### Development & Build
- **Development Server**: Vite dev server with HMR support
- **Build Process**: Vite for frontend, esbuild for backend bundling
- **Type Safety**: Strict TypeScript configuration across the stack
- **Code Quality**: Path mapping for clean imports and organized file structure

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit OIDC provider for user authentication
- **Session Storage**: connect-pg-simple for PostgreSQL session management

### AI Services
- **Google Gemini**: AI model for proposal generation and template enhancement
- **API Integration**: Official Google GenAI SDK for reliable AI interactions

### Third-party Libraries
- **UI Components**: Comprehensive Radix UI primitives for accessible components
- **Export Libraries**: html2canvas and jsPDF for PDF export, docx for Word documents
- **Form Management**: React Hook Form with Zod schema validation
- **Date Handling**: date-fns for date manipulation and formatting
- **Development Tools**: tsx for TypeScript execution, various Vite plugins for development experience
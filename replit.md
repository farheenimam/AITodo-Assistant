# AI To-Do Assistant

## Overview

This is an AI-powered task management application built as a full-stack web application. The system provides intelligent task prioritization, deadline management, and premium features through a modern React frontend with a Node.js/Express backend. Users can create, manage, and organize their tasks with AI-generated suggestions and insights. The application includes both free and premium tiers, with premium features unlocked through Solana-based payments via Crossmint integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system for consistent, accessible interface components
- **Styling**: Tailwind CSS with custom design tokens supporting both light and dark themes
- **State Management**: TanStack Query for server state management with local React state for UI interactions
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture  
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript throughout the entire stack
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **Storage**: In-memory storage implementation with interface for future database integration
- **API Design**: RESTful API endpoints with proper error handling and request logging

### Database Schema
- **Users Table**: Stores user accounts with email, password, premium status, and Google OAuth support
- **Tasks Table**: Contains task details including title, description, deadline, priority levels, and completion status
- **Premium Requests Table**: Tracks Solana payment transactions for premium upgrades with status management
- **ORM**: Drizzle ORM configured for PostgreSQL with schema-first approach and migration support

### Design System
- **Material Design 3**: Foundation for productivity-focused interface patterns
- **Typography**: Inter font family with consistent sizing scale
- **Color Palette**: Comprehensive light/dark mode support with semantic color tokens
- **Component Library**: Comprehensive set of reusable UI components built on Radix primitives

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication with 7-day expiration
- **Password Security**: Bcrypt hashing with salt rounds for secure password storage
- **Google OAuth**: Integrated Google authentication for seamless user onboarding
- **Protected Routes**: Middleware-based route protection with token validation

## External Dependencies

### Core Infrastructure
- **Neon Database**: PostgreSQL database hosting with serverless connection pooling
- **Drizzle ORM**: Type-safe database operations with schema management and migrations

### Payment Processing
- **Crossmint**: Solana blockchain payment gateway for premium subscription processing
- **Solana Integration**: Cryptocurrency payment handling for premium feature access

### UI & Design
- **Radix UI**: Headless component primitives for accessibility and consistent behavior
- **Tailwind CSS**: Utility-first CSS framework with custom design token configuration
- **Lucide Icons**: Consistent icon library with React components
- **Google Fonts**: Inter font family for typography consistency

### Development Tools
- **Vite**: Fast development server and build tool with HMR support
- **TypeScript**: Type safety across frontend, backend, and shared code
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Performant form handling with minimal re-renders
- **Zod**: Runtime type validation and schema definition

### Authentication Services
- **Google OAuth**: Third-party authentication provider integration
- **JWT**: JSON Web Token implementation for stateless authentication
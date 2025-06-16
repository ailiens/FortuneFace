# Physiognomy Analysis Application

## Overview

This is a modern web application that performs physiognomy (face reading) analysis using AI-powered facial landmark detection. The application allows users to upload photos, analyzes facial features using face-api.js, and provides insights based on traditional physiognomy principles. Built with a React frontend and Express backend, it features a clean, Korean-inspired design aesthetic.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom Korean-themed color palette
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ESM modules
- **API Structure**: RESTful endpoints for health checks and image analysis
- **File Handling**: Multer for multipart file uploads
- **Development**: Hot module replacement via Vite integration

### AI/ML Integration
- **Face Detection**: face-api.js for browser-based facial landmark detection
- **Analysis Engine**: Custom physiognomy rules engine that interprets facial features
- **Feature Extraction**: Automated landmark detection for eyes, nose, mouth, forehead, chin, and jawline

## Key Components

### Core Features
1. **Image Upload System**: Drag-and-drop interface with file validation
2. **Face Analysis Pipeline**: Real-time facial landmark detection and feature extraction
3. **Physiognomy Engine**: Rule-based system that analyzes facial features and provides personality insights
4. **Results Visualization**: Interactive display of analysis results with progress indicators and detailed breakdowns
5. **Gender-Aware Analysis**: Optional gender selection for more accurate interpretations

### UI Components
- **Upload Area**: Custom drag-and-drop zone with preview functionality
- **Analysis Results**: Comprehensive display of physiognomy findings with scores and interpretations
- **Face Overlay**: Visual representation of detected facial landmarks
- **Progress Tracking**: Multi-step analysis workflow with visual feedback

### Database Schema
- **analyses**: Stores analysis results with facial landmarks, physiognomy results, and metadata
- **Fields**: id, imageUrl, gender, facialLandmarks (JSONB), analysisResults (JSONB), createdAt

## Data Flow

1. **Image Upload**: User uploads photo via drag-and-drop or file selection
2. **Client-Side Processing**: face-api.js detects facial landmarks in the browser
3. **Feature Analysis**: Custom physiognomy rules analyze detected features
4. **Results Generation**: System generates personality insights and trait scores
5. **Data Persistence**: Analysis results saved to PostgreSQL database
6. **Visualization**: Results displayed with interactive UI components

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **face-api.js**: Browser-based face detection and landmark recognition
- **multer**: File upload handling middleware
- **@tanstack/react-query**: Server state management and caching

### UI Libraries
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant API for component styling
- **lucide-react**: Modern icon library

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **drizzle-kit**: Database schema management and migrations

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Assets**: Static files served from public directory

### Environment Configuration
- **Development**: `npm run dev` starts both frontend and backend with HMR
- **Production**: `npm run start` serves optimized build
- **Database**: PostgreSQL connection via DATABASE_URL environment variable

### Platform Integration
- **Replit**: Configured for autoscale deployment with port forwarding
- **Database**: Supports both local development and cloud PostgreSQL instances
- **File Storage**: Local uploads directory for image processing

## Changelog
- June 16, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.
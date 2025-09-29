# Entelechy

**Entelechy** is a comprehensive productivity application designed to help you organize your tasks, events, and notes in one beautifully designed platform. Built with modern web technologies, it provides an intuitive and seamless experience for managing your daily workflow.

🌐 **Live Demo**: [entelechy.dev](https://entelechy.dev)

[![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://entelechy.dev)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.0-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com)

## ✨ Features

### 📊 **Smart Dashboard**

- **Productivity Tracking**: Real-time completion rate calculation with visual feedback
- **Quick Stats**: Overview of tasks, upcoming events, recent notes, and productivity metrics
- **Intelligent Greetings**: Time-based personalized messages
- **Quick Actions**: Fast access to create tasks, events, and notes
- **Activity Feed**: Recent activity across all modules

### ✅ **Advanced Task Management**

- **Kanban Board**: Drag-and-drop interface with three columns (Uncompleted, In Progress, Completed)
- **Table View**: Detailed list view with sorting and filtering
- **Priority Levels**: High, Medium, Low importance with color coding
- **Due Dates**: Date tracking with visual indicators
- **Categories**: Organize tasks by custom categories
- **Advanced Filtering**: Filter by status, importance, category, and due date
- **Search**: Real-time search across all tasks
- **Quick Status Updates**: One-click status cycling

### 📅 **Comprehensive Calendar**

- **Multiple Views**: Month, Week, Day, and Year views
- **Event Management**: Create, edit, and delete events with rich details
- **All-Day Events**: Support for full-day events
- **Recurring Events**: Set up repeating events with custom patterns
- **Color Coding**: Organize events by color categories
- **Time Zones**: Proper time handling and display
- **Event Details**: Location, notes, and descriptions
- **Quick Event Creation**: Fast event creation from any view

### 📝 **Smart Notes System**

- **Rich Text Support**: Formatted content with markdown-like features
- **Tagging System**: Organize notes with multiple tags
- **Search & Filter**: Full-text search and tag-based filtering
- **Starred Notes**: Mark important notes for quick access
- **Related Items**: Link notes to tasks or events
- **Statistics**: Track note creation and update patterns
- **Grid Layout**: Visual card-based organization

### 🔐 **Secure Authentication**

- **Google OAuth**: Seamless sign-in with Google accounts
- **Session Management**: Secure session handling with Supabase
- **Profile Management**: User profile and preferences
- **Multi-device Sync**: Access your data from anywhere

### 🎨 **Modern User Experience**

- **Dark/Light Mode**: Automatic system preference detection with manual toggle
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Keyboard Shortcuts**: Productivity-focused keyboard navigation
  - `Ctrl+S`: Toggle sidebar
  - `Ctrl+T`: Tasks page
  - `Ctrl+N`: Notes page
  - `Ctrl+C`: Calendar page
  - `Ctrl+H`: Dashboard
  - `Ctrl+D`: Toggle dark mode
- **Toast Notifications**: Real-time feedback for all actions
- **Loading States**: Elegant loading indicators throughout the app

## 🛠️ Technology Stack

### Frontend

- **Next.js 15.3.0**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth interactions
- **Lucide React**: Beautiful icon library
- **@hello-pangea/dnd**: Drag and drop functionality

### Backend & Database

- **Supabase**: Backend-as-a-Service with PostgreSQL
- **Real-time Subscriptions**: Live data updates
- **Row Level Security**: Secure data access
- **Authentication**: Built-in auth with OAuth providers

### State Management & Validation

- **Zod**: TypeScript-first schema validation
- **React Hooks**: Modern state management patterns
- **Custom Hooks**: Reusable logic for auth and data fetching

### UI Components

- **Radix UI**: Headless UI components
- **Sonner**: Toast notifications
- **Custom Components**: Tailored UI elements for optimal UX

## 🚀 Quick Start

### Try Entelechy Now

**🌐 Live Application**: Simply visit [entelechy.dev](https://entelechy.dev) to start using Entelechy immediately!

No installation required - just sign in with your Google account and start organizing your productivity.

---

### Local Development Setup

_For developers who want to run Entelechy locally or contribute to the project:_

#### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase project
- Google Cloud Console project (for OAuth)

#### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Jinkuman/Entelechy
   cd entelechy
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**

   Create a `.env.local` file in the root directory:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**

   Set up your Supabase database with the required tables:

   - `tasks` - Task management
   - `events` - Calendar events
   - `notes` - Note storage

   Enable Row Level Security (RLS) for all tables.

5. **Google OAuth Configuration**

   Follow the detailed guide in `GOOGLE_OAUTH_SETUP.md` to configure Google authentication.

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Getting Started

1. **Visit**: Go to [entelechy.dev](https://entelechy.dev)
2. **Sign In**: Use Google OAuth to authenticate
3. **Dashboard**: Start from the main dashboard to get an overview
4. **Create Content**: Use the + buttons or keyboard shortcuts to create tasks, events, or notes
5. **Organize**: Use tags, categories, and priorities to organize your content
6. **Track Progress**: Monitor your productivity through the dashboard metrics

### Keyboard Shortcuts

- `Ctrl+S`: Toggle sidebar
- `Ctrl+T`: Navigate to Tasks
- `Ctrl+N`: Navigate to Notes
- `Ctrl+C`: Navigate to Calendar
- `Ctrl+H`: Navigate to Dashboard
- `Ctrl+D`: Toggle dark/light mode

### Tips for Maximum Productivity

- Use the Kanban board for visual task management
- Set priorities and due dates for better task organization
- Tag your notes for easy retrieval
- Use the dashboard to track your daily productivity
- Take advantage of keyboard shortcuts for faster navigation

## 🔧 Configuration

### Customization Options

- **Themes**: Automatic dark/light mode switching
- **Notifications**: Toast notifications for all actions
- **Data Persistence**: All data synced with Supabase in real-time

### Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=         # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Your Supabase anonymous key
```

## 📦 Build & Deployment

### Production Build

```bash
npm run build
npm start
```

### Deployment Options

- **Vercel**: Optimized for Next.js applications
- **Netlify**: JAMstack deployment
- **Docker**: Containerized deployment
- **Railway/Heroku**: Platform-as-a-Service deployment

## 🔒 Security Features

- **Row Level Security**: Database-level access control
- **Authentication**: Secure OAuth implementation
- **Environment Variables**: Sensitive data protection
- **HTTPS**: Secure data transmission
- **Input Validation**: Zod schema validation throughout

## 🆘 Support

Reach out if you think of new features that will make the app even better!

---



# App Blueprint: Notionary (Clean Note-Taking App)

## 1. Project Breakdown

**App Name:** Notionary  
**Platform:** Web  
**Summary:** Notionary is a minimalist note-taking application with hierarchical organization (Notebooks → Sections → Pages). The app focuses on distraction-free writing with a clean interface using shades of gray and white, featuring a persistent sidebar for easy navigation through the note structure.  

**Primary Use Case:**  
- Users create and organize notes in a tree structure  
- Markdown-supported rich text editing  
- Quick navigation between different levels of notes  
- Clean, focused writing environment  

**Authentication:**  
- Email/password auth via Supabase  
- Optional GitHub OAuth integration  
- Session management with Supabase Auth  

## 2. Tech Stack Overview

**Frontend Framework:**  
- Next.js 14 (App Router)  
- React 18 with Server Components where beneficial  

**UI Library:**  
- Tailwind CSS for utility-first styling  
- ShadCN UI components (customizable with gray/white theme)  

**Backend (BaaS):**  
- Supabase for:  
  - PostgreSQL database (note hierarchy storage)  
  - Authentication  
  - Real-time updates for collaborative features  

**Deployment:**  
- Vercel for Next.js optimized hosting  
- Supabase project connected via environment variables  

## 3. Core Features

1. **Hierarchical Note Organization**  
   - Notebooks (top-level containers)  
   - Sections (groupings within notebooks)  
   - Pages (individual notes)  

2. **Persistent Navigation Sidebar**  
   - Collapsible tree view of the entire structure  
   - Drag-and-drop reorganization  
   - Visual indicators for active/edited items  

3. **Rich Text Editor**  
   - Markdown support with live preview  
   - Basic formatting toolbar (ShadCN components)  
   - Word count and reading time indicators  

4. **Search Functionality**  
   - Full-text search across all notes  
   - Filter by notebook/section  

5. **Theme System**  
   - Light/dark mode (grayscale only)  
   - Custom ShadCN theme with neutral palette  

6. **Real-time Syncing**  
   - Instant updates across devices  
   - Conflict resolution for offline edits  

## 4. User Flow

1. **Authentication**  
   - Landing page with auth options  
   - New users get a default "Getting Started" notebook  

2. **Notebook Creation**  
   - Click "+" button in sidebar  
   - Name the notebook (e.g., "Work Projects")  

3. **Adding Sections/Pages**  
   - Right-click notebook → "Add Section"  
   - Click section → "Add Page"  
   - Auto-saves on changes  

4. **Editing Experience**  
   - Split view: Sidebar + editor  
   - Focus mode (hides sidebar)  
   - Keyboard shortcuts for common actions  

5. **Organization**  
   - Drag items in sidebar to reorganize  
   - Right-click context menus for actions  

## 5. Design & UI/UX Guidelines

**Color Palette:**  
- Primary: `slate-50` to `slate-900` gradient  
- Accents: `slate-200` for borders, `slate-700` for text  
- Backgrounds: `white`/`slate-950` for light/dark modes  

**Typography:**  
- Inter font family (via Tailwind)  
- Base size: 16px  
- Editor: Monospace option available  

**Spacing System:**  
- 4px base unit  
- Sidebar: 280px width (collapsible to 64px)  

**ShadCN Components to Use:**  
- `Command` palette for quick navigation  
- `Dialog` for modals  
- `ContextMenu` for right-click actions  
- `TreeView` for note hierarchy  
- `Tabs` for possible split-pane editing  

**Motion Principles:**  
- Subtle animations for state changes  
- 200ms transition duration standard  

## 6. Technical Implementation

**Frontend Structure:**  
```
/app
  /(auth) - Auth routes
  /(main) - Protected routes
    /notebooks/[id] - Dynamic notebook pages
      /sections/[id] - Nested sections
        /pages/[id] - Final note pages
```

**Supabase Schema:**  
```sql
-- Notebooks table
CREATE TABLE notebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sections table
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notebook_id UUID REFERENCES notebooks(id) ON DELETE CASCADE,
  title TEXT,
  position FLOAT -- For manual ordering
);

-- Pages table
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Implementation Details:**  
1. Use Next.js Server Actions for data mutations  
2. Implement optimistic UI updates for quick interactions  
3. Use Supabase Realtime for live updates  
4. Create custom ShadCN theme with:  
   ```ts
   // tailwind.config.js
   theme: {
     extend: {
       colors: {
         border: "hsl(var(--slate-200))",
         input: "hsl(var(--slate-200))",
         ring: "hsl(var(--slate-400))",
         background: "hsl(var(--white))",
         foreground: "hsl(var(--slate-900))",
       }
     }
   }
   ```

## 7. Development Setup

**Requirements:**  
- Node.js 18+  
- Supabase account  
- Vercel account  

**Setup Instructions:**  
1. Clone repository  
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Set up environment variables:  
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Run development server:  
   ```bash
   npm run dev
   ```

**Supabase Setup:**  
1. Create new project  
2. Run schema SQL from section 6  
3. Enable Row Level Security  
4. Configure auth providers  

**Vercel Deployment:**  
1. Connect Git repository  
2. Add same environment variables  
3. Deploy with default Next.js settings  

This blueprint provides a complete foundation for building Notionary with the specified tech stack while maintaining the clean, hierarchical note-taking vision.
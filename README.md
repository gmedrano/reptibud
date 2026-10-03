# ReptiBud - Reptile Care Logbook

For current repository state and safe next actions, see [HANDOFF](HANDOFF.md).

A mobile-first Next.js web application for tracking basic reptile care.

## Version 0.1 - Logbook Mode

This is an internal dogfooding MVP focused on speed, clarity, and daily usage.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** CSS Components with BEM naming convention
- **Authentication:** Supabase Auth
- **Storage:** JSON files (temporary, per pet)

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

4. Add your Supabase credentials to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
reptibud/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── pets/              # Pet management pages
│   ├── globals.css        # Global styles and design tokens
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (redirects)
├── components/            # Reusable UI components
│   ├── Button/
│   ├── Input/
│   ├── Textarea/
│   ├── Card/
│   └── EmptyState/
├── lib/                   # Utility libraries
│   ├── supabase/         # Supabase client configuration
│   ├── storage/          # JSON file storage utilities
│   └── types/            # TypeScript type definitions
├── documents/            # Project documentation
└── user-data/            # Pet data storage (gitignored)
```

## Features

### Core Features (v0.1)

- **Pet Management (CRUD)**
  - Create, view, edit, and delete pets
  - Required fields: name, species
  - Optional: photo

- **Feeding Tracker**
  - One-tap quick feeding log
  - Optional notes per feeding
  - Auto-timestamped entries

- **Care/Health Timeline**
  - Chronological log of all care events
  - Log types: feeding, shedding, note
  - Newest entries first

## Design Principles

- Mobile-first, responsive design
- Touch-friendly interactions (48px minimum touch targets)
- No hover-only interactions
- Calm, neutral, functional aesthetic
- BEM CSS naming convention enforced
- Component-scoped CSS only

## Explicitly Out of Scope (v0.1)

- AI features
- Analytics or charts
- Health scoring
- Notifications
- Social features
- Database persistence (using JSON for now)

## Development Guidelines

### CSS Rules

- Use CSS Components only (one CSS file per component)
- Follow BEM naming convention
- No inline styles
- No Tailwind or CSS-in-JS
- Mobile-first breakpoints

### Component Structure

- All UI elements must be reusable
- Avoid page-specific styling
- Prefer composition over conditionals

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Data Storage

Pet data is stored as JSON files in `/user-data/{user-id}/pets/`:

```json
{
  "id": "uuid",
  "name": "Kophii",
  "species": "Ball Python",
  "photoUrl": "/uploads/kophii.jpg",
  "createdAt": "ISO_DATE",
  "updatedAt": "ISO_DATE",
  "logs": [
    {
      "id": "uuid",
      "type": "feeding",
      "content": "Ate one mouse",
      "timestamp": "ISO_DATE"
    }
  ]
}
```

## Future Migration

This JSON storage approach is temporary and designed to be easily migrated to Supabase database in future versions.

## License

ISC

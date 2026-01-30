# Architecture Overview

This project prioritizes simplicity and clarity.

## Frontend
- Next.js using App Router
- Server Components where possible
- Client Components only when needed
- Mobile-first responsive layout

## Styling
- Component-scoped CSS files
- BEM naming convention
- No inline styles
- No global CSS except resets / tokens

## Authentication
- Supabase Auth
- Email + password only
- No roles or permissions
- Auth required for all app routes

## Data Storage (Temporary)
- No database in v0.1
- Each pet stored as a JSON file
- Files scoped per authenticated user

## Key Constraint
This architecture is intentionally temporary.
It must be easy to migrate JSON storage to a database later.
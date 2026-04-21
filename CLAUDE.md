# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Project Overview

This is "领航工作站工作台" (Navigator Workstation) — a member profile management system for "one person, one policy" scenarios. It consolidates member basic info, growth trajectory, ideological status, and issues/suggestions into a single searchable, trackable interface.

# Tech Stack

- Next.js 16 App Router
- React 19
- Prisma 7 with SQLite (adapter: `better-sqlite3`)
- shadcn/ui + Tailwind CSS v4
- Zod for form validation
- React Compiler enabled (`reactCompiler: true` in next.config.ts)

# Common Commands

```bash
npm install          # Install dependencies
npm run dev         # Start development server (http://localhost:3000)
npm run build       # Build production version
npm run lint        # Run ESLint

# Database operations
npm run db:generate  # Generate Prisma Client to src/generated/prisma
npm run db:push      # Sync schema to SQLite (uses prisma.config.ts)
npm run db:seed      # Seed demo data (2 member profiles)
```

# Architecture

## Data Flow

```
API Route (src/app/api/members/route.ts)
  → navigator-data.ts: saveMemberDraft() / getMemberDrafts()
    → Prisma Client (src/generated/prisma)
      → SQLite (dev.db)
```

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/navigator-data.ts` | Zod schema validation, DB serialization/deserialization, write input transformation |
| `src/lib/navigator-shared.ts` | Type definitions and factory functions (MemberDraft, ActivityDraft, etc.) |
| `src/components/navigator/` | Workspace UI components organized by tab (basic-info, growth, ideology, issues) |
| `prisma/schema.prisma` | Prisma schema (output path: `src/generated/prisma`) |
| `prisma.config.ts` | Prisma 7 config — datasource URL from env, migrations path, seed command |

## Prisma 7 Note

Prisma 7 uses a config file (`prisma.config.ts`) instead of `schema.prisma` for datasource configuration. The schema file only defines models. Run `db:push` (not `prisma db push`) to sync schema to database.

## Database Models

MemberProfile is the root entity with one-to-many relations:
- `activities` → ActivityRecord (participation in events, key performances, career development)
- `keyPerformances` → KeyPerformance
- `careerRecords` → CareerRecord
- `contacts` → ContactPerson (3 fixed roles: school, college, mentor)
- `conversations` → ConversationRecord (heart-to-heart talks)
- `issueSuggestions` → IssueSuggestion (questions and suggestions with status)

Contacts are unique per role per profile (3 contacts max).

## UI Architecture

The workspace uses a tab-based layout inside `navigator-workspace.tsx`. Each tab component (`basic-info-tab.tsx`, `growth-tab.tsx`, `ideology-tab.tsx`, `issues-tab.tsx`) owns its form section. Form state is held in `member-sidebar.tsx` which passes data down via a custom hook. The `types.ts` file re-exports draft types from `navigator-shared.ts` for use in components.

## File Upload

Uploads are handled by `src/app/api/upload/route.ts` and saved to `public/uploads`. The upload API returns a URL path, not a full URL.

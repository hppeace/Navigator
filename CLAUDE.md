# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Project Overview

This is "领航工作站工作台" (Navigator Workstation) — a member profile management system for "one person, one policy" scenarios. It consolidates member basic info, growth trajectory, ideological status, and issues/suggestions into a single searchable, trackable interface.

# Tech Stack

- Next.js 16 App Router
- React 19
- Prisma 7 with SQLite (adapter: `better-sqlite3`)
- shadcn/ui (style: `radix-nova`) + Tailwind CSS v4
- Zod for form validation
- NextAuth v5 beta (Credentials provider, JWT strategy)
- React Compiler enabled (`reactCompiler: true` in next.config.ts)
- xlsx library for Excel import/export

# Common Commands

```bash
npm install          # Install dependencies
npm run dev         # Start development server (http://localhost:3000)
npm run build       # Build production version
npm run lint        # Run ESLint

# Database operations
npm run db:generate  # Generate Prisma Client to src/generated/prisma
npm run db:push      # Sync schema to SQLite (uses prisma.config.ts)
npm run db:seed      # Seed demo data (2 member profiles + admin/user accounts)
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
| `src/lib/navigator-shared.ts` | Type definitions, factory functions, and option constants (MemberDraft, ethnicityOptions, etc.) |
| `src/lib/auth.ts` | NextAuth config — Credentials provider, JWT callbacks, isAdmin/employeeId in session |
| `src/lib/prisma.ts` | Prisma singleton with BetterSqlite3 adapter |
| `src/components/navigator/` | Workspace UI components organized by tab (basic-info, growth, ideology, issues, collaboration) |
| `src/app/admin/users/` | Admin-only user management page |
| `prisma/schema.prisma` | Prisma schema (output path: `src/generated/prisma`) |
| `prisma.config.ts` | Prisma 7 config — datasource URL from env, migrations path, seed command |

## Prisma 7 Note

Prisma 7 uses a config file (`prisma.config.ts`) instead of `schema.prisma` for datasource configuration. The schema file only defines models. Run `db:push` (not `prisma db push`) to sync schema to database.

## Environment Variables

Required in `.env`:
- `DATABASE_URL` — SQLite path (e.g. `file:./dev.db`)
- `AUTH_SECRET` — NextAuth secret (`openssl rand -base64 32`)

## Database Models

MemberProfile is the root entity with one-to-many relations:
- `activities` → ActivityRecord (participation in events, key performances, career development)
- `keyPerformances` → KeyPerformance
- `careerRecords` → CareerRecord
- `contacts` → ContactPerson (3 fixed roles: school, college, mentor)
- `conversations` → ConversationRecord (heart-to-heart talks)
- `issueSuggestions` → IssueSuggestion (development needs with status)
- `changeRequests` → ProfileChangeRequest (admin approval system)
- `collaborationNeed` → CollaborationNeed (collaboration platform)

Contacts are unique per role per profile (3 contacts max).

## UI Architecture

The workspace uses a tab-based layout inside `navigator-workspace.tsx`. All form state (draft, profiles list, active profile, dirty tracking) lives in `navigator-workspace.tsx` via `useState`. Tab components (`basic-info-tab.tsx`, `growth-tab.tsx`, `ideology-tab.tsx`, `issues-tab.tsx`, `collaboration-tab.tsx`) are pure presentational — they receive the draft and updater callbacks as props. `member-sidebar.tsx` renders the profile list and search. `types.ts` defines shared function signatures (`UpdateFieldFn`, `UpdateListItemFn`, etc.) used across tab components.

Data flows one direction: `navigator-workspace.tsx` holds `draft` + `setDraft` → passes `updateField` / `updateListItem` / `appendListItem` / `removeListItem` callbacks down to tabs → tabs call these to mutate state. Saving calls `POST /api/members` which validates via Zod (`memberDraftSchema`) and upserts.

## Authentication & User Roles

NextAuth v5 beta with Credentials provider. Auth config in `src/lib/auth.ts`. Session uses JWT strategy. `isAdmin` and `employeeId` are stored in the JWT token and session.

- **Admin users**: See all profiles, can create/delete members, approve change requests, manage users
- **Regular users**: See only their own profile, submit change requests for approval

Default accounts:
- Admin: `admin` / `admin123`
- User: `LH2026001` / `user123`

New registrations create both a User account and MemberProfile. Password for imported members defaults to `12345678`.

## Admin Approval System

When regular users save profile changes, a `ProfileChangeRequest` is created instead of direct database update. Admins can:
1. View pending requests in the "修改审核" tab
2. Click "查看详情" to compare original vs modified data
3. Approve (saves to database) or reject (with reason)

The system stores both `originalData` and `snapshotData` as JSON strings in the `ProfileChangeRequest` table.

## Collaboration Platform

The "合作需求" tab allows members to publish collaboration needs. Features:
- Two tabs: "我发布的" (can edit/close/delete) and "其他成员发布" (view only)
- Displays author's contact info (email, phone, research direction) from MemberProfile
- Authors can close/reopen their needs; admins can delete any

## File Upload

Uploads are handled by `src/app/api/upload/route.ts` and saved to `public/uploads`. The upload API returns a URL path, not a full URL.

## Excel Import/Export

Admin-only feature. Export (`GET /api/members/export`) generates an `.xlsx` file with Chinese column headers. Import (`POST /api/members/import`) accepts `.xlsx` via FormData, maps Chinese headers back to `MemberDraft` fields, and upserts each row. Import also resets the user password to a default (`12345678`).

## Important Notes

- The `AGENTS.md` file warns that Next.js 16 may have breaking changes from training data — check `node_modules/next/dist/docs/` when uncertain about APIs.
- Prisma Client is generated to `src/generated/prisma` (not the default `node_modules/.prisma`). Import from `@/generated/prisma/client`.
- The Prisma singleton in `src/lib/prisma.ts` uses `PrismaBetterSqlite3` adapter directly (not the default driver).
- shadcn/ui is configured with `radix-nova` style and `lucide` icon library (see `components.json`).
- All UI text is in Chinese (zh-CN). The `lang` attribute in `layout.tsx` is set to `zh-CN`.
- List items (activities, conversations, etc.) can be deleted to empty arrays — the `removeListItem` function allows this.
- The `createBlankMemberDraft()` function initializes all lists as empty arrays.

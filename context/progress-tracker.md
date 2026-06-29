# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Editor home wired to real API. Moving to canvas editor.

## Current Goal

- Feature 08: Canvas editor shell (React Flow integration).

## Completed

- Next.js 16 boilerplate cleaned up (stripped globals.css, removed SVGs, minimal page.tsx).
- Feature 01: Design System — shadcn/ui (Radix + Nova preset) installed and configured, all 7 UI primitives added (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), lucide-react installed, lib/utils.ts with cn() created, globals.css rewritten with full dark-only palette (shadcn semantic tokens + app design tokens), html carries `dark` class so shadcn dark variants are always active.
- Feature 02: Editor Chrome — EditorNavbar (fixed top bar, sidebar toggle with PanelLeftOpen/PanelLeftClose icons, left/center/right sections) and ProjectSidebar (fixed overlay, slides in from left without pushing content, Projects header + close button, My Projects/Shared tabs with empty states, full-width New Project button). Dialog pattern ready via existing shadcn Dialog component.
- Feature 03: Authentication — ClerkProvider with dark theme from @clerk/ui/themes wrapping root layout. proxy.ts at project root using clerkMiddleware and createRouteMatcher to protect all non-public routes. Sign-in and sign-up pages with two-panel layout (logo/tagline/feature list on left, Clerk form on right; form-only on mobile). Root page redirects authenticated users to /editor and unauthenticated users to /sign-in. UserButton added to editor navbar right section. app/editor/page.tsx created as the editor shell entry point.
- Feature 04: Project dialogs — editor home screen (heading + New Project button), Create/Rename/Delete project dialogs, sidebar project list with rename/delete actions on owned projects, mobile backdrop scrim. useProjectDialogs hook owns dialog/form/loading state and mock project list. lib/mock-projects.ts holds MockProject type and slugify util.
- Feature 05: Prisma data layer — prisma/models/project.prisma with Project (ownerId, name, description?, status enum DRAFT/ARCHIVED, canvasJsonPath?, timestamps, indexes on ownerId+createdAt) and ProjectCollaborator (projectId cascade, collaboratorEmail, createdAt, unique on project/email, indexes on email and project/date). lib/prisma.ts singleton branches on DATABASE_URL prefix: prisma+postgres:// → plain PrismaClient (Accelerate), otherwise → PrismaPg adapter. Global cache for hot-reload in dev. Migration SQL created at prisma/migrations/20260629000000_init_project_models/; client generated to app/generated/prisma. NOTE: migration not yet applied — database at pooled.db.prisma.io was unreachable; run `npx prisma migrate deploy` when connectivity is restored.
- Feature 06: Project API routes — GET /api/projects (list owner's projects), POST /api/projects (create; defaults name to "Untitled Project"; accepts optional `id` to align with Liveblocks room ID), PATCH /api/projects/[projectId] (rename; 403 for non-owner), DELETE /api/projects/[projectId] (delete; 403 for non-owner). All routes return 401 for unauthenticated requests. Clerk `auth()` used server-side; ownership checked against `project.ownerId`.
- Feature 07: Wire editor home to real API — `lib/projects.ts` helper fetches owned+shared projects server-side; `app/editor/page.tsx` is an async server component; `EditorHome` client component owns sidebar/dialog interactivity; `useProjectActions` hook (create calls POST with client-generated room ID → navigate to workspace, rename calls PATCH → refresh, delete calls DELETE → redirect or refresh); `slugify` added to `lib/utils.ts`; sidebar and dialogs typed against `Project` from `lib/projects.ts`; create dialog shows live room ID preview.

## In Progress

- None.

## Next Up

- Feature 08: Canvas editor shell (React Flow).

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Dark-only theme. `:root` carries the dark palette for shadcn semantic tokens. App design tokens (--bg-base, --bg-surface, etc.) are defined alongside and mapped to Tailwind utilities via @theme inline (bg-base, bg-surface, text-copy-primary, text-brand, etc.).
- shadcn components in components/ui/ are not modified — custom styling goes in app-level components.
- `html` element always carries the `dark` class, activating shadcn's @custom-variant dark permanently.

## Session Notes

- Token utility names: bg-base, bg-surface, bg-elevated, bg-subtle, text-copy-primary, text-copy-secondary, text-copy-muted, text-copy-faint, text-brand, bg-brand-dim, text-ai, text-ai-text, bg-err/ok/warn.
- No raw Tailwind color classes (zinc-*, slate-*) or hardcoded hex values in app components.
- Radius scale: rounded-xl (small elements), rounded-2xl (cards), rounded-3xl (modals).

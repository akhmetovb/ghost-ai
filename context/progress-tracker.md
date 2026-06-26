# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Editor Chrome — complete. Moving to authentication.

## Current Goal

- Add Clerk authentication and route protection (Feature 03).

## Completed

- Next.js 16 boilerplate cleaned up (stripped globals.css, removed SVGs, minimal page.tsx).
- Feature 01: Design System — shadcn/ui (Radix + Nova preset) installed and configured, all 7 UI primitives added (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), lucide-react installed, lib/utils.ts with cn() created, globals.css rewritten with full dark-only palette (shadcn semantic tokens + app design tokens), html carries `dark` class so shadcn dark variants are always active.
- Feature 02: Editor Chrome — EditorNavbar (fixed top bar, sidebar toggle with PanelLeftOpen/PanelLeftClose icons, left/center/right sections) and ProjectSidebar (fixed overlay, slides in from left without pushing content, Projects header + close button, My Projects/Shared tabs with empty states, full-width New Project button). Dialog pattern ready via existing shadcn Dialog component.

## In Progress

- None.

## Next Up

- Feature 03: Authentication and route protection (Clerk).

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

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an admin manga management application (v3) built with Nuxt 4 and Nuxt UI v4. It's a modern Vue 3 application using TypeScript and styled with Nuxt UI components built on top of Tailwind CSS.

## Package Manager

**Always use `pnpm` for all package operations.** This project is configured with pnpm workspaces and specific ignored built dependencies.

## Development Commands

### Core Commands
```bash
# Install dependencies
pnpm install

# Start development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## Architecture

### Nuxt 4 Structure
- **`app/`** - Main application directory (Nuxt 4 uses `app/` instead of traditional root-level directories)
  - `app.vue` - Root layout with UApp, UHeader, UMain, UFooter structure
  - `app.config.ts` - App-level configuration (UI theme colors)
  - `pages/` - File-based routing
  - `components/` - Auto-imported Vue components
  - `assets/` - Uncompiled assets (CSS, images)

### UI Framework
- **Nuxt UI v4** (`@nuxt/ui`) - Component library built on Tailwind CSS
- Components use `U` prefix convention (e.g., `UButton`, `UApp`, `UHeader`)
- Theme configuration in `app.config.ts` with primary: 'green', neutral: 'slate'
- Dark mode support via `UColorModeButton`
- Icons from Iconify collections: `@iconify-json/lucide` and `@iconify-json/simple-icons`

### Configuration
- **Nuxt config** (`nuxt.config.ts`):
  - ESLint module with stylistic rules (no trailing commas, 1tbs brace style)
  - Route rules for prerendering
  - Custom CSS: `~/assets/css/main.css`
  - Devtools enabled

- **TypeScript**: Uses Nuxt-generated tsconfig references (`.nuxt/tsconfig.*.json`)

### SEO & Meta
The application uses Nuxt's `useHead()` and `useSeoMeta()` composables for managing meta tags and SEO in `app.vue`. Update these when changing site metadata.

## Code Style

ESLint is configured with:
- No trailing commas (`commaDangle: 'never'`)
- 1TBS brace style (`braceStyle: '1tbs'`)
- Nuxt-specific auto-import rules

Always run `pnpm lint` before committing.

## Key Patterns

### Auto-imports
Nuxt 4 auto-imports:
- Vue composables (ref, computed, etc.)
- Nuxt composables (useHead, useSeoMeta, etc.)
- Components from `app/components/`
- Utils from `app/utils/` (if created)

No need to explicitly import these - just use them directly.

### Component Structure
- Use `<script setup>` syntax for all Vue components
- Leverage Nuxt UI components for consistent design
- Icon syntax: `i-{collection}-{icon}` (e.g., `i-simple-icons-github`, `i-lucide-menu`)

### Routing
File-based routing from `app/pages/`:
- `pages/index.vue` → `/`
- `pages/about.vue` → `/about`
- `pages/[id].vue` → dynamic route `/123`

## Development Notes

- The project uses Nuxt 4's new `app/` directory structure
- Production builds are optimized with route-level prerendering
- The app is currently a starter template and will be customized for manga administration

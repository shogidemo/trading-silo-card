# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**trading-silo** - A monorepo containing educational games about grain silos, grains, and trading companies.

### Apps

1. **card-collection** (`apps/card-collection/`) - Quiz-based card collection game. Users answer quizzes to collect cards in three categories: Silos, Grains, and Traders.
2. **grain-voyage** (`apps/grain-voyage/`) - Bulk ship simulation game. As a trading company dispatcher, manage grain deliveries to silos across Japan. Features dice-based navigation (Momotetsu-style), AI competitor ships, and mission-based gameplay.

### Shared Package

- **@trading-silo/shared** (`packages/shared/`) - Common data and types shared between apps (silos, grains, traders)

## Commands

```bash
# Root level (Turborepo)
pnpm install         # Install all dependencies
pnpm dev             # Start all apps in dev mode
pnpm build           # Build all apps
pnpm lint            # Lint all apps

# App-specific
pnpm dev:card        # Start card-collection dev server
pnpm dev:voyage      # Start grain-voyage dev server (localhost:3001)
pnpm build:card      # Build card-collection
pnpm build:voyage    # Build grain-voyage

# Within apps/card-collection/
pnpm dev             # Start development server (localhost:3000)
pnpm build           # Production build
pnpm lint            # ESLint
pnpm validate:data   # Validate quiz/card data integrity
pnpm test:e2e        # Run Playwright E2E tests
pnpm test:e2e:ui     # Run Playwright tests with UI
```

## Architecture

**Tech Stack**: Turborepo, pnpm workspaces, Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, Leaflet/react-leaflet, Playwright

### Directory Structure

```
trading-silo/
├── apps/
│   ├── card-collection/     # Quiz card collection game
│   │   ├── src/
│   │   │   ├── app/         # Next.js App Router pages
│   │   │   ├── components/  # React components
│   │   │   ├── context/     # React contexts
│   │   │   ├── data/        # App-specific data (quizzes)
│   │   │   ├── hooks/       # Custom hooks
│   │   │   ├── lib/         # Utilities
│   │   │   └── types/       # TypeScript types
│   │   └── e2e/             # Playwright tests
│   │
│   └── grain-voyage/        # Bulk ship game
│       ├── src/
│       │   ├── app/         # Next.js App Router pages
│       │   ├── components/  # React components
│       │   ├── context/     # React contexts (GameContext)
│       │   ├── data/        # App-specific data (routes, scenarios)
│       │   ├── game/        # Game logic (engine, AI, events)
│       │   ├── hooks/       # Custom hooks
│       │   ├── lib/         # Utilities
│       │   └── types/       # TypeScript types
│       └── e2e/             # Playwright tests
│
├── packages/
│   └── shared/              # Shared data and types
│       └── src/
│           ├── data/        # silos.ts, grains.ts, traders.ts
│           └── types/       # Card type definitions
│
├── turbo.json               # Turborepo config
├── pnpm-workspace.yaml      # pnpm workspace config
└── package.json             # Root package.json
```

### Data Model

Three card types extend `BaseCard`: `SiloCard`, `GrainCard`, `TraderCard`. Each has unique properties (e.g., silos have capacity/location with GPS coordinates, grains have nutrients/origins). Quizzes link to cards via `cardId`.

**Shared data** (in `@trading-silo/shared`):
- 25 silos with GPS coordinates
- 7 grain types
- 11 trading companies

### State Management

`CollectionContext` (card-collection app) provides:
- `collectedCardIds` - IDs of earned cards
- `totalQuizAttempts` / `correctAnswers` - Stats tracking
- `categoryStats` - Per-category accuracy tracking
- `wrongAnswerQuizIds` - Quiz IDs for review mode

### Features (card-collection)

- **Quiz Modes**: Single quiz, 3-question challenge mode, review mode
- **Accessibility**: Keyboard navigation, screen reader support, reduced motion
- **Data Management**: Export/import progress as JSON, reset progress
- **Image Optimization**: Uses next/image

### Testing

- E2E tests in `apps/card-collection/e2e/` use Playwright
- localStorage key: `silo-card-collection`

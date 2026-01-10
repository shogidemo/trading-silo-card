# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

穀物サイロカードコレクション - An educational quiz-based card collection game about grain silos, grains, and trading companies. Users answer quizzes to collect cards in three categories: Silos (サイロ), Grains (穀物), and Traders (商社).

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```

## Architecture

**Tech Stack**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion

### Key Directories

- `src/app/` - Next.js App Router pages
  - `page.tsx` - Home with progress dashboard
  - `quiz/page.tsx` - Quiz flow (category select → quiz → result → card reveal)
  - `collection/page.tsx` - Card gallery with filtering
- `src/components/Card/` - Card display components (FlipCard, CardDetail, CardReveal)
- `src/data/` - Static data files for grains, silos, traders, and quizzes
- `src/context/CollectionContext.tsx` - Global state for collected cards and quiz stats (localStorage persistence)
- `src/types/index.ts` - TypeScript interfaces for Card, Quiz, CollectionState

### Data Model

Three card types extend `BaseCard`: `SiloCard`, `GrainCard`, `TraderCard`. Each has unique properties (e.g., silos have capacity/location, grains have nutrients/origins). Quizzes link to cards via `cardId` - correct answers unlock the associated card.

### State Management

`CollectionContext` provides:
- `collectedCardIds` - IDs of earned cards
- `totalQuizAttempts` / `correctAnswers` - Stats tracking
- Progress helpers: `getProgress()`, `getCategoryProgress()`

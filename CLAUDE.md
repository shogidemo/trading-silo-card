# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

穀物サイロカードコレクション - An educational quiz-based card collection game about grain silos, grains, and trading companies. Users answer quizzes to collect cards in three categories: Silos (サイロ), Grains (穀物), and Traders (商社).

## Commands

```bash
npm run dev        # Start development server (localhost:3000)
npm run build      # Production build
npm run lint       # ESLint
npm run test:e2e   # Run Playwright E2E tests
npm run test:e2e:ui # Run Playwright tests with UI
```

## Architecture

**Tech Stack**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, Playwright

### Key Directories

- `src/app/` - Next.js App Router pages
  - `page.tsx` - Home with progress dashboard
  - `quiz/page.tsx` - Quiz flow (category select → quiz → result → card reveal)
  - `collection/page.tsx` - Card gallery with filtering
  - `settings/page.tsx` - Settings with export/import/reset
- `src/components/Card/` - Card display components (FlipCard, CardDetail, CardReveal)
- `src/data/` - Static data files for grains, silos, traders, and quizzes
- `src/context/CollectionContext.tsx` - Global state for collected cards and quiz stats (localStorage persistence)
- `src/hooks/` - Custom hooks (useReducedMotion, useModalAccessibility)
- `src/lib/` - Utility functions (animations, styles, quizUtils)
- `src/types/index.ts` - TypeScript interfaces for Card, Quiz, CollectionState
- `e2e/` - Playwright E2E test files

### Data Model

Three card types extend `BaseCard`: `SiloCard`, `GrainCard`, `TraderCard`. Each has unique properties (e.g., silos have capacity/location, grains have nutrients/origins). Quizzes link to cards via `cardId` - correct answers unlock the associated card.

### State Management

`CollectionContext` provides:
- `collectedCardIds` - IDs of earned cards
- `totalQuizAttempts` / `correctAnswers` - Stats tracking
- `categoryStats` - Per-category accuracy tracking
- `wrongAnswerQuizIds` - Quiz IDs for review mode
- Progress helpers: `getProgress()`, `getCategoryProgress()`, `getCategoryAccuracy()`
- Review mode: `addWrongAnswer()`, `removeWrongAnswer()`, `getWrongAnswerQuizIds()`

### Features

- **Quiz Modes**: Single quiz, 3-question challenge mode, review mode (wrong answers)
- **Accessibility**: Keyboard navigation, screen reader support, reduced motion support
- **Data Management**: Export/import progress as JSON, reset progress
- **Image Optimization**: Uses next/image for optimized image loading

### Accessibility

The app includes:
- `useReducedMotion` hook for respecting user's motion preferences
- `useModalAccessibility` hook for ESC key handling and focus trapping
- Keyboard navigation for all interactive elements
- ARIA attributes and screen reader announcements

# Copilot Instructions

## Project Overview

Cinematic personal portfolio for Bernardo Moschen — a Next.js 15 / React 19 / TypeScript site with a custom CSS design system, Three.js globe, scroll-driven cinematic sections, EN/PT-BR i18n, ambient audio, and an optional AI concierge powered by Gemini 2.5 Flash-Lite. No UI library — every component is hand-built so the visual language stays specific to this site.

## Technology Stack

- **Framework**: Next.js 15 (App Router; edge runtime for `/api/chat`)
- **Language**: TypeScript 5.9 (strict)
- **UI runtime**: React 19
- **Styling**: Vanilla CSS in `src/app/globals.css` + per-component inline styles, driven by CSS custom properties (`var(--color-primary)`, etc.). Two themes via `data-theme="dark" | "light"`.
- **3D**: Three.js + `@react-three/fiber` + drei + postprocessing
- **Animation**: `motion` (Framer Motion successor); `useReducedMotion` everywhere; View Transitions API for theme/lang fades
- **Smooth scroll**: Lenis (auto-disabled when `prefers-reduced-motion: reduce`)
- **Audio**: Web Audio API
- **i18n**: Custom EN / PT-BR (`src/i18n/`)
- **Email**: Resend (`/api/contact`)
- **KV**: `@vercel/kv` (likes counter, concierge rate limiter)
- **AI (optional)**: `@google/genai` → `gemini-2.5-flash-lite`

## Code Style Guidelines

- Functional components with hooks; no class components.
- TypeScript strict — no `any` unless justified with a comment.
- Theme tokens via CSS custom properties; **never** hardcode colors.
- Every animation path must respect `useReducedMotion()` (Motion) or `matchMedia('(prefers-reduced-motion: reduce)')` and degrade gracefully — see `LoadingScreen.tsx`, `CinematicSection.tsx`, `Pin.tsx`, `Concierge.tsx` for patterns.
- New visible string ⇒ add to **both** `src/i18n/translations/en.ts` and `pt-br.ts`. The schema is `typeof en`, so missing keys break the build.
- Heavy / client-only components (`Scene3D`, `Concierge`) use `next/dynamic({ssr:false})`.
- Match the existing storyline tone for case-study copy: short, evocative, opinionated. Numbers should be verifiable from the source data.
- Run `yarn tsc --noEmit` before declaring work done.

## Component Structure

- `src/app/` — App Router pages, layout, metadata, OG image route, API routes (`chat`, `contact`, `likes`).
- `src/components/3d/` — `Scene3D`, `GlobeWireframe`, `CSSGlobe` fallback, `WebGLErrorBoundary`.
- `src/components/ai/` — `Concierge`, `ConciergeMessage` (the optional Gemini-powered concierge widget).
- `src/components/audio/` — `AmbientAudio`, `SoundContext`.
- `src/components/data/` — `projectsData`, `aboutData`, `certificationsData` (structural data; copy lives in translations).
- `src/components/layout/` — `App`, `Navigation`, `CinematicSection`, `LoadingScreen`, `CustomCursor`, etc.
- `src/components/projects/storyline/` — Reusable case-study primitives (`Heading`, `Paragraph`, `CodeBlock`, `CountUp`, `Metrics`, `BeforeAfter`, `Pin`) wired by `Storyline.tsx`. Adding a new kind: extend `types.ts`, add a primitive component, add a case in `Storyline.tsx`'s switch.
- `src/components/sections/` — Top-level sections (Hero, About, Projects, Certifications, Contact, Footer).
- `src/components/theme/` — `ThemeContext` with View Transition–wrapped flips.
- `src/components/ui/` — `BottomRightHUD` (likes button), `KonamiOverlay`.
- `src/components/utils/` — `AnimateOnScroll`, `TiltCard`, validation helpers.
- `src/hooks/` — `useKonamiCode`, `useConciergeStream`, etc.
- `src/i18n/` — `I18nProvider`, `useI18n`, `translations/{en,pt-br}.ts`.
- `src/lib/` — `conciergeBus` (EventTarget singleton), `llm/` (system prompt + Gemini + mock + dispatcher), `rateLimit` (KV sliding-window with in-memory fallback).
- `src/config/` — `site.ts`, API constants.
- `src/constants/`, `src/utils/` — shared maps and helpers.

## Key Conventions

- **i18n is the source of truth for copy** — including project storyline blocks. `projectsData.ts` carries only structural data (slug, image, technologies, urls, status); titles, descriptions, and storylines are read via `mergeWithTranslations`. Cast storyline arrays as `StorylineBlock[]` at the leaf so the union types resolve.
- **No new top-level sections** without explicit ask — the Hero / About / Projects / Certifications / Contact spine is intentional.
- **Reduced motion is non-negotiable**. Test by toggling DevTools → Rendering → Emulate CSS media `prefers-reduced-motion: reduce` on every animated component.
- **Concierge is feature-flagged** — the widget mounts only when `NEXT_PUBLIC_CONCIERGE_ENABLED=1`. The `/api/chat` route always works; it returns Gemini if `GOOGLE_AI_API_KEY` is set, else a deterministic mock (`src/lib/llm/mock.ts`). Tool calls flow through `conciergeBus` to `ProjectsSection` (`highlightProject`) and `App` (`scrollToSection`).
- **Rate limiting** uses `src/lib/rateLimit.ts`. KV-backed when env vars are present, in-memory `Map` fallback for local dev. Reuse this — don't re-introduce per-route in-memory limiters (the legacy one in `/api/contact` is grandfathered).
- **Edge runtime** for `/api/chat` (declared via `export const runtime = 'edge'`). Keep it edge-compatible — no Node built-ins beyond what `@vercel/kv` and `@google/genai` already use.

## Development Workflow

- Package manager: **yarn** (`yarn dev`, `yarn build`, `yarn lint`, `yarn test`, `yarn analyze`).
- The dev server is on `http://localhost:3000` (Next bumps to 3001 if 3000 is taken).
- For concierge work: set `NEXT_PUBLIC_CONCIERGE_ENABLED=1` in `.env.local`; leave `GOOGLE_AI_API_KEY` unset to drive against the mock fixture (cheap iteration, deterministic).
- Curl the SSE stream to verify: `curl -N -X POST http://localhost:3000/api/chat -H 'content-type: application/json' -d '{"messages":[{"role":"user","content":"show me portfolio"}],"locale":"en"}'`.
- Type-check before committing: `yarn tsc --noEmit`.

## Don'ts

- Don't reintroduce a UI library (Material UI, Chakra, etc.) — the design system is intentional.
- Don't add new colors outside `globals.css` custom properties.
- Don't hard-code English strings in components; thread them through `useI18n()`.
- Don't bypass `prefers-reduced-motion`.
- Don't log message contents from `/api/chat` — only counters for rate-limit are persisted.

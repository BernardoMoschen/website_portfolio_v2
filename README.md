# Bernardo Moschen — Portfolio v2

A cinematic Next.js portfolio that doubles as a playground: WebGL globe tracing flight paths between cities I've worked from, scroll-driven sections, ambient audio reactive to navigation, full bilingual (EN / PT-BR) support, project case studies authored as a typed "storyline" of primitives, and an optional AI concierge powered by Gemini 2.5 Flash-Lite.

Live: <https://bernardomoschen.dev>

---

## Tech stack

| Layer | What |
| --- | --- |
| Framework | [Next.js 15](https://nextjs.org/) (App Router, edge runtime where it matters) |
| UI | React 19 + TypeScript 5.9 |
| Styling | Vanilla CSS with custom properties (`var(--color-*)`); two themes (`data-theme="dark"\|"light"`); no UI library |
| 3D | [Three.js](https://threejs.org/) + [@react-three/fiber](https://r3f.docs.pmnd.rs) + drei + postprocessing |
| Animation | [Motion](https://motion.dev/) (Framer Motion successor), View Transitions API for theme/lang fades |
| Smooth scroll | [Lenis](https://lenis.darkroom.engineering/) (auto-disabled for `prefers-reduced-motion`) |
| Audio | Web Audio API (procedural ambience + UI feedback) |
| i18n | Custom EN / PT-BR with auto-detect from `navigator.language` |
| Email | [Resend](https://resend.com) (contact form) |
| KV | [@vercel/kv](https://vercel.com/storage/kv) (likes counter, concierge rate limiter) |
| AI (optional) | [@google/genai](https://www.npmjs.com/package/@google/genai) → `gemini-2.5-flash-lite` |
| Analytics | `@vercel/analytics`, `@vercel/speed-insights` |
| Tests | Jest + Testing Library (suite is light — see `to-do.md`) |

Runtime targets: Lighthouse Performance ≥ 95, 3D bundle ~244 KB gz, full reduced-motion respect everywhere.

---

## Getting started

```bash
yarn install
cp .env.example .env.local      # then fill in what you need
yarn dev                        # http://localhost:3000
```

Required env: none for the core site. Without any keys, contact form, likes, and concierge all degrade gracefully (in-memory rate limit, mock concierge, contact form returns an error if Resend isn't set).

| Variable | Purpose | Default behavior if unset |
| --- | --- | --- |
| `RESEND_API_KEY` | Contact form mail delivery | Form returns an error |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN` (+ siblings) | Likes counter, concierge rate-limit persistence | Likes counter unavailable; concierge falls back to in-memory rate-limit |
| `GOOGLE_AI_API_KEY` | Live Gemini replies in the AI concierge | Concierge serves a deterministic mock fixture |
| `NEXT_PUBLIC_CONCIERGE_ENABLED` | Mounts the concierge widget in the UI when `=1` | Widget is not rendered |
| `SITE_URL`, `SITE_DOMAIN`, `CONTACT_EMAIL` | Metadata, sitemap, OG | Falls back to `siteConfig` defaults |

See [`.env.example`](.env.example) for the full list.

### Scripts

| Command | Action |
| --- | --- |
| `yarn dev` | Dev server with HMR |
| `yarn build` | Production build |
| `yarn start` | Run the production build locally |
| `yarn lint` | `next lint` |
| `yarn test` | Jest |
| `yarn test:watch` | Jest in watch mode |
| `yarn analyze` | Build with bundle analyzer |

---

## Project structure

```text
src/
├── app/
│   ├── layout.tsx                    Root layout, metadata, OG tags, JSON-LD
│   ├── page.tsx                      Home (mounts <App />)
│   ├── globals.css                   Theme tokens, .glass, view-transition styles
│   ├── og/route.tsx                  Dynamic OG image (per slug or default)
│   ├── projects/[slug]/page.tsx      Per-project static page
│   └── api/
│       ├── chat/route.ts             AI concierge SSE stream (edge runtime)
│       ├── contact/route.ts          Resend mail handler
│       └── likes/route.ts            KV-backed global likes counter
├── components/
│   ├── 3d/                           Scene3D, GlobeWireframe, CSSGlobe fallback
│   ├── ai/                           Concierge widget + message bubble
│   ├── audio/                        AmbientAudio + SoundContext
│   ├── data/                         projectsData, aboutData, certificationsData
│   ├── layout/                       App, Navigation, CinematicSection, LoadingScreen…
│   ├── projects/storyline/           Reusable case-study primitives (see below)
│   ├── sections/                     Hero / About / Projects / Certifications / Contact
│   ├── theme/                        ThemeContext (dark ↔ light, View Transitions)
│   ├── ui/                           BottomRightHUD (likes), KonamiOverlay, …
│   └── utils/                        AnimateOnScroll, TiltCard, validation, …
├── hooks/                            useKonamiCode, useConciergeStream, …
├── i18n/                             I18nProvider + translations/{en,pt-br}.ts
├── lib/
│   ├── conciergeBus.ts               EventTarget bus: highlightProject / scrollToSection
│   ├── llm/                          systemPrompt + gemini + mock + dispatcher
│   └── rateLimit.ts                  KV sliding-window with in-memory fallback
└── config/                           Site config, API constants
public/
├── certifications/                   Credential PDFs / badges
├── data/certifications.json          Source of truth for certifications list
└── project-*.jpg, profile-photo.webp, resume.pdf, …
```

---

## Key systems

### Theme + View Transitions

`ThemeContext` flips `data-theme` on `<html>`. When the browser supports `document.startViewTransition` and the user hasn't requested reduced motion, the flip is wrapped in a transition + `flushSync` so the entire viewport cross-dissolves over ~320 ms instead of snapping. `i18n/index.ts` does the same wrap for EN ↔ PT-BR. `globals.css` defines the cross-fade and overrides it to `animation: none !important` under `prefers-reduced-motion: reduce`.

### Cinematic scroll

`CinematicSection` pins each top-level section while a tall scroll height passes, driving fades and content reveals via Motion's `useScroll` + `useTransform`. Lenis provides the smooth-scroll feel on capable browsers; touch devices and reduced-motion preferences fall back to native scroll.

### 3D globe

`Scene3D` renders a wireframe globe with bezier-curve flight paths between cities I've worked from. It's `next/dynamic({ssr:false})`, lazy-loaded, and watched by a `WebGLErrorBoundary`. A `CSSGlobe` static fallback covers no-JS / no-WebGL / pre-WebGL-init. The shader picks up `scrollState` and `mouseState` uniforms (audio is the planned third — see `to-do.md`).

### Project storyline system

Each project page renders a reusable "storyline" — an array of typed blocks declared in `i18n/translations/{en,pt-br}.ts` under `project_items.<slug>.storyline`, dispatched by [`Storyline.tsx`](src/components/projects/storyline/Storyline.tsx) into primitive components in [`src/components/projects/storyline/`](src/components/projects/storyline/).

Available block kinds:

| Kind | Component | What it does |
| --- | --- | --- |
| `heading` | `Heading.tsx` | h2/h3 with on-enter reveal |
| `paragraph` | `Paragraph.tsx` | Prose with optional center alignment |
| `code` | `CodeBlock.tsx` | Glass-card snippet with viewport-triggered typewriter (full text on reduced motion) |
| `countUp` | `CountUp.tsx` | Animated number, gradient text, `tabular-nums` |
| `metrics` | `Metrics.tsx` | Auto-fit grid of CountUps |
| `beforeAfter` | `BeforeAfter.tsx` | Pointer + keyboard image-comparison slider with `clip-path` reveal |
| `pin` | `Pin.tsx` | Sticky-hero block — content holds attention while a configured viewport-distance scrolls past; renders inline under reduced motion |

Adding a new storyline: extend `project_items.<slug>.storyline` in **both** `en.ts` and `pt-br.ts` and cast the array `as StorylineBlock[]`. The merge in `projectsData.ts` reads it via `text?.storyline`. See the `portfolio` entry as the canonical example.

Deferred: `ScrollVideo` primitive (frame-scrubbed `<video>`) — skipped until real video assets exist.

### AI concierge (optional)

A floating bottom-left pill expands into a glass chat panel. Replies stream from `/api/chat` (SSE, edge runtime); when the model emits a tool call it's forwarded as an `event: tool` SSE line, parsed by [`useConciergeStream`](src/hooks/useConciergeStream.ts), and dispatched through [`conciergeBus`](src/lib/conciergeBus.ts).

Tool calls available to the model:

- `highlightProject({slug})` — `ProjectsSection` listens, scrolls the matching card into view, and pulses a glowing ring for ~1.6 s (outline-only under reduced motion).
- `scrollToSection({id})` — `App` listens, calls `getElementById(id)?.scrollIntoView()` for `about | projects | technical | certifications | contact`.

Three things to know:

1. **Two backends.** [`src/lib/llm/index.ts`](src/lib/llm/index.ts) picks **real Gemini** (`@google/genai`, `gemini-2.5-flash-lite`) when `GOOGLE_AI_API_KEY` is set, otherwise a **deterministic mock fixture** ([`mock.ts`](src/lib/llm/mock.ts)) that streams char-by-char and triggers tool events on keyword match (`portfolio` / `telecom` / `edtech` / `mining` / `about` / `skills` / `contact`). The mock is locale-aware (EN + PT-BR fixtures).
2. **Feature flag.** The widget is only mounted when `NEXT_PUBLIC_CONCIERGE_ENABLED=1`. The route itself (`/api/chat`) is always reachable; it returns whatever the configured backend produces.
3. **Rate limited.** `src/lib/rateLimit.ts` runs a KV-backed sliding-window limiter — 10 messages per IP per hour. When KV env vars aren't set (local dev), it falls back to an in-memory `Map`.

The system prompt is assembled in [`systemPrompt.ts`](src/lib/llm/systemPrompt.ts) from `aboutData.experiences`, `projectsData`, and `certificationsData`. It supports `mode: 'text' | 'voice'` — `voice` mode adds a "1–2 short spoken sentences, max 80 words" constraint, ready for a future voice-call mode.

Estimated cost when live: ~R$5 / month at projected traffic (Gemini Flash-Lite is ~$0.10 / M tokens in, $0.40 / M out), hard-capped by the rate limiter. See `.env.example` and `/api/chat/route.ts` for the wiring.

### i18n

Schema is `typeof en` (`src/i18n/index.ts`). Adding a key means adding it to both `translations/en.ts` and `translations/pt-br.ts` — TypeScript will fail the build if you forget. `useI18n()` returns `{ locale, setLocale, t }`. Locale persists in `localStorage`, defaults from `navigator.language`. Switching locale uses View Transitions for a cross-fade.

### Likes

`/api/likes` increments a single global counter in Vercel KV; per-IP write is a 24-hour SET-NX (one like per visitor per day). The HUD button at bottom-right reads from `LikesContext`.

---

## Deployment

Vercel is the intended target — App Router, edge functions, KV, and the analytics/speed-insights packages are all first-class.

1. Import the repo into Vercel.
2. Storage → KV → create + link the database (env vars are auto-populated).
3. Add `RESEND_API_KEY`. Optional: `GOOGLE_AI_API_KEY`, `NEXT_PUBLIC_CONCIERGE_ENABLED`.
4. Push.

Other static-but-compatible hosts work (Netlify, Cloudflare Pages) but you'll have to provide a KV-compatible adapter or accept the in-memory fallback for likes / rate-limits.

---

## Conventions

- TypeScript everywhere, strict mode.
- Functional components, hooks. No class components.
- Theme tokens via CSS custom properties; no hardcoded colors.
- Every animation path checks `useReducedMotion()` (Motion) or `matchMedia('(prefers-reduced-motion: reduce)')` and degrades. References: `LoadingScreen.tsx`, `CinematicSection.tsx`, `Pin.tsx`.
- New visible string ⇒ both `en.ts` and `pt-br.ts`.
- Heavy / client-only components (`Scene3D`, `Concierge`) are loaded with `next/dynamic({ssr:false})`.

---

## License

Source code is open under [MIT](LICENSE). The personal content (case studies, copy, photo) belongs to me — feel free to fork the structure, but please replace the content with your own.

---

## Roadmap

See [`to-do.md`](to-do.md) for the active backlog and recently shipped items.

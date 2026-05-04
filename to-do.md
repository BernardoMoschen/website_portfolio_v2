# To-do List

- [ ] Gather resume from request
- [x] Connect ContactForm to actually send something
- [x] Enhance performance (migrated Astro → Next.js)
- [ ] Improve white/light theme colors
- [x] Unify and centralize SSOT for constant data
- [x] View Transitions for theme + language toggles (with reduced-motion override)
- [x] Storyline primitives: `Heading`, `Paragraph`, `CodeBlock` (typewriter), `CountUp`, `Metrics`, `BeforeAfter`, `Pin`
- [x] Storyline content authored EN+PT-BR for `portfolio`, `telecom-backoffice`, `edtech-platform`, `mining-data-platform`
- [x] Move storyline copy from `projectsData.ts` into `i18n/translations/{en,pt-br}.ts`
- [x] AI Concierge backend (`/api/chat` edge SSE) — dual-mode: real Gemini if `GOOGLE_AI_API_KEY` set, deterministic mock otherwise
- [x] AI Concierge UI (bottom-left pill + glass panel, feature-flagged via `NEXT_PUBLIC_CONCIERGE_ENABLED`)
- [x] KV-backed sliding-window rate limiter (`src/lib/rateLimit.ts`) with in-memory fallback — 10 chat msgs / IP / hour
- [x] `conciergeBus` event bus + `useConciergeStream` SSE parser; tool calls fire `highlightProject` (pulse + scroll) and `scrollToSection`

## Ideas

- [ ] Bring recommendations from LinkedIn profile
- [ ] Is there a way to unify professional experiences with LinkedIn API?
- [ ] Hero section data is redundant: exchange for something flashy/funny?
- [ ] **Provision `GOOGLE_AI_API_KEY`** and flip `NEXT_PUBLIC_CONCIERGE_ENABLED=1` — this turns the mock concierge into the real Gemini-powered one. ~R$5/mo at projected traffic, capped by rate limiter.
- [ ] **Voice-call mode (Phase 5)** — reuses `/api/chat` with `mode: 'voice'`. Web Speech API for STT/TTS (browser-native, free). Plumbing already future-proofed in `systemPrompt.ts`.
- [ ] **`ScrollVideo` storyline primitive** — frame-scrubbed `<video>` via `requestVideoFrameCallback`. Skipped this iteration (no assets yet); add when a clip lands.
- [ ] **`Pin` block adoption** — primitive built but not yet wired into a project storyline. Consider opening one of the flagship projects (e.g. `mining-data-platform`) with a `Pin` to anchor the section.
- [ ] **Cmd+K command palette** — search projects/sections, jump anywhere; doubles as discoverability for the Konami code.
- [ ] **Time-aware theme** — auto-flip dark/light by visitor's local hour with a "syncing to your timezone" microcopy on first visit.
- [ ] **Focus mode** — press `F` to dim everything except the current section.

---

## SEO, Visibility & Accessibility

## 🔴 Critical (bugs / broken behavior)

- [x] **Fix SoundContext hydration mismatch** — Already fixed: `useState(true)` as SSR-safe
      default, `useEffect` syncs from localStorage after hydration.

- [x] **Create `/public/og-image.jpg`** — Replaced with a dynamic OG image generator at
      `/src/app/og/route.tsx` using `next/og` (ImageResponse). Metadata URLs updated to `/og`.

## 🟡 SEO & Discoverability

- [X] **Submit sitemap to Google Search Console** — The sitemap at `/sitemap.xml` exists but
      Google won't crawl it until you submit it manually at search.google.com/search-console.

- [x] **Add canonical URL to metadata** — Added `alternates: { canonical: siteConfig.url }` to
      `layout.tsx` and per-project canonical in `projects/[slug]/page.tsx`.

- [x] **Add `rel="me"` links** — Added `<link rel="me">` for GitHub and LinkedIn in `layout.tsx`.

- [ ] **Link GitHub + LinkedIn profile bios to the domain** — Google follows profile links.
      Add `https://bernardomoschen.dev` (or your domain) to both bios for inbound authority.
      (Manual action — no code needed.)

- [x] **Add JSON-LD to project detail pages** — Added `SoftwareApplication` schema to
      `/projects/[slug]/page.tsx` using project data.

- [x] **Fix `lastModified` in sitemap** — Sitemap currently omits `lastModified` (correct behavior).
      No action needed.

## 🟢 Accessibility

- [ ] **Audit color contrast** — Run Lighthouse or axe DevTools. The orange secondary color on
      dark backgrounds may not meet WCAG AA (4.5:1 for body text, 3:1 for large text).

- [x] **Add `aria-live` to loading screen** — Added `role="status"` and `aria-live="polite"`
      to `LoadingScreen.tsx`.

- [x] **Keyboard navigation for project filter tabs** — Upgraded to full ARIA `role="tablist"`
      / `role="tab"` pattern with arrow-key, Home, and End navigation in `ProjectsSection.tsx`.

- [x] **Audit all image `alt` text** — Improved alt text on project screenshot image and
      certification logos (`ProjectDetail.tsx`, `CertificationCard.tsx`).

- [ ] **Test with screen reader** — Navigate the full page with VoiceOver (Mac) or NVDA
      (Windows) to catch unlabelled interactive elements or confusing reading order.

## 🔵 Performance (Lighthouse)

- [ ] **Migrate project/profile images to Next.js `<Image>`** — Gets automatic WebP
      conversion, responsive sizing, and prevents CLS (requires explicit width/height).

- [x] **Preload hero profile photo** — Already present in `layout.tsx:119` as
      `<link rel="preload" href="/profile-photo.webp" fetchPriority="high" />`.

- [ ] **Run bundle analyzer** — Add `@next/bundle-analyzer` and check if Three.js or any
      other dependency can be split further to reduce initial JS payload.

- [x] **Profile image format mismatch** — Updated `site.ts` and `Hero/utils.ts` to `.webp`,
      matching the existing `<link rel=preload>` in `layout.tsx`.

- [x] **3D scene has no loading state** — Added `glReady` state to `Scene3D.tsx`; `CSSGlobe`
      shown during `pending` mode and while WebGL initializes, then fades out once canvas is ready.

## 🟢 Accessibility (new)

- [x] **Form error messages not linked to inputs** — Added `aria-describedby`, `id`, `role=alert`,
      and `aria-live=assertive` to all four contact form fields and their error spans.

- [x] **LikeButton not keyboard-accessible** — Already a proper `<button>` element; natively
      handles Enter/Space. No changes needed.

- [x] **Add 3D scene fallback for no-JS / no-WebGL** — Already handled: `CSSGlobe` fallback,
      `prefers-reduced-motion` guard, and `WebGLErrorBoundary` all present. No changes needed.

## 🔴 Code Quality

- [x] **Duplicate `statusMap`** — Extracted to `src/constants/projectConstants.ts`; both
      `ProjectsSection` and `ProjectDetail` now import from there.

- [x] **Duplicate email regex** — Extracted to `src/utils/validation.ts`; both `ContactSection`
      and `api/contact/route.ts` now import `EMAIL_REGEX` from there.

- [x] **Magic numbers in API route** — Moved to `src/config/api.ts` (`RATE_LIMIT_WINDOW`,
      `RATE_LIMIT_MAX`, `FIELD_MAX_LENGTHS`).

- [ ] **Refactor ContactSection** — 700+ lines with heavy inline styles (`ContactSection.tsx:176-705`).
      Extract styles to `contact.module.css` and split the blob/animation logic into a
      sub-component.

- [ ] **Split ProjectDetail into sub-components** — `ProjectDetail.tsx` is 800+ lines with
      66+ inline style objects. Split into `ProjectHero`, `ProjectTechStack`, `ProjectResults`,
      and `ProjectNavigation`.

## 🟡 Testing

- [ ] **Add test suite — zero coverage currently** — No `.test.tsx` / `.spec.ts` files exist.
      Start with:
      - `ContactSection.test.tsx` — validation rules, submission, error states
      - `validation.test.ts` — email regex, field length rules
      - `api/contact.test.ts` — rate limiting, input sanitization
      - `ThemeContext.test.tsx` — theme persistence, system preference detection

## 🔵 Features / Ideas

- [x] **Dynamic OG images per project page** — Extended `/og` route with `?slug` param; project
      pages now pass slug-specific `openGraph` and `twitter` metadata.

- [ ] **Stronger resume CTA** — The PDF exists at `/resume.pdf` and the hero button is present,
      but consider anchoring it more prominently (e.g. sticky in the nav or floating CTA).

- [ ] **Blog / articles section** — MDX-based at `/blog`. Natural fit with the stack; adds a
      content channel without third-party dependencies.

- [x] **JSON-LD author field on project pages** — Already present in
      `projects/[slug]/page.tsx`. No changes needed.

- [x] **Add `article` Open Graph type to project pages** — Added `openGraph.type: 'article'`
      in `projects/[slug]/page.tsx` in the previous session.

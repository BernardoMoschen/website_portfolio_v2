# To-do List

- [ ] Gather resume from request
- [x] Connect ContactForm to actually send something
- [x] Enhance performance (migrated Astro → Next.js)
- [ ] Improve white/light theme colors
- [ ] Unify and centralize SSOT for constant data

# Ideas

- [ ] Bring recommendations from LinkedIn profile
- [ ] Is there a way to unify professional experiences with LinkedIn API?
- [ ] Hero section data is redundant: exchange for something flashy/funny?

---

## SEO, Visibility & Accessibility

## 🔴 Critical (bugs / broken behavior)

- [ ] **Fix SoundContext hydration mismatch** — `getInitialMuted()` reads localStorage during
      the initial render. The server always gets `true` (muted) but the client may read `false`
      from localStorage, causing the React hydration error seen in the screenshot.
      Fix: always initialize `useState(true)`, then sync from localStorage in `useEffect`.

- [x] **Create `/public/og-image.jpg`** — Replaced with a dynamic OG image generator at
      `/src/app/og/route.tsx` using `next/og` (ImageResponse). Metadata URLs updated to `/og`.

## 🟡 SEO & Discoverability

- [ ] **Submit sitemap to Google Search Console** — The sitemap at `/sitemap.xml` exists but
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

- [ ] **Add `aria-live` to loading screen** — Screen readers don't announce the state change
      when the loading curtain lifts. Wrap the status in `<div aria-live="polite">`.

- [ ] **Keyboard navigation for project filter tabs** — The All/Professional/Personal tabs
      should support arrow key navigation (ARIA `role="tablist"` + `role="tab"` pattern).

- [ ] **Audit all image `alt` text** — Profile photo and project images need descriptive `alt`
      attributes, not just filenames or empty strings.

- [ ] **Test with screen reader** — Navigate the full page with VoiceOver (Mac) or NVDA
      (Windows) to catch unlabelled interactive elements or confusing reading order.

## 🔵 Performance (Lighthouse)

- [ ] **Migrate project/profile images to Next.js `<Image>`** — Gets automatic WebP
      conversion, responsive sizing, and prevents CLS (requires explicit width/height).

- [ ] **Preload hero profile photo** — The avatar is above-the-fold and should be added to
      the `<link rel="preload">` list in `layout.tsx`.

- [ ] **Run bundle analyzer** — Add `@next/bundle-analyzer` and check if Three.js or any
      other dependency can be split further to reduce initial JS payload.

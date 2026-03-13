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

- [ ] **Create `/public/og-image.jpg`** — The OG image is referenced in metadata but the file
      doesn't exist. Without it, LinkedIn, WhatsApp, and Twitter link previews show no image.
      Create a 1200×630px image and place it at `/public/og-image.jpg`.

## 🟡 SEO & Discoverability

- [ ] **Submit sitemap to Google Search Console** — The sitemap at `/sitemap.xml` exists but
      Google won't crawl it until you submit it manually at search.google.com/search-console.

- [ ] **Add canonical URL to metadata** — Add `alternates: { canonical: siteConfig.url }` to
      the `metadata` export in `layout.tsx` to prevent duplicate-content issues.

- [ ] **Add `rel="me"` links** — In `layout.tsx <head>`, add:
      `<link rel="me" href="[linkedin-url]">` and `<link rel="me" href="[github-url]">`.
      Establishes identity verification signals for Google.

- [ ] **Link GitHub + LinkedIn profile bios to the domain** — Google follows profile links.
      Add `https://bernardomoschen.dev` (or your domain) to both bios for inbound authority.

- [ ] **Add JSON-LD to project detail pages** — `/projects/[slug]` pages are SSG but have no
      structured data. Add a `SoftwareApplication` or `CreativeWork` schema per project so
      Google can surface them in rich results.

- [ ] **Fix `lastModified` in sitemap** — Currently uses `new Date()` on every build, telling
      crawlers "everything changed today" every deploy. Set real dates or derive from git.

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

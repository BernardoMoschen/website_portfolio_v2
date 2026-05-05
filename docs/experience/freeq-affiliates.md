# Freeq Affiliates — Personal Engineering Reflection

> A retrospective artifact compiled from internal Notion documentation (UAM Season 3 — Affiliates teamspace). Source dates: March 13 – April 16, 2026. Compiled May 4, 2026.
>
> **Purpose:** to remember, analyze, and contemplate the work done on this platform — and to extract concrete material that can be re-used in a CV, portfolio narrative, or interview answers.

---

## 1. The project at a glance

**Freeq Affiliates** (originally tracked under the codename **UAM Season 3**) is a **Shopify-native affiliate attribution platform** built around an unusual architectural premise:

> *"The affiliate platform where neither the brand nor the creator owns the proof."*

Where every other affiliate network is operated by the same party that pays the creators (an unavoidable conflict of interest), Freeq sits between the two sides as an **independent measurement authority**. Conversion records are written to an immutable on-chain ledger that neither party can mutate. The party that owes money does not control how the money is measured.

The project pivoted mid-cycle: it began as a crypto-native payout system and ended up as a **fiat-first product with on-chain attribution only**. That distinction is the key architectural insight of the whole engagement — see §4.

### Where I fit

I was assigned to the **frontend stream** (Hiren-led), with explicit ownership of the **Creator Earnings page (UAM-445)** — one of the two primary value surfaces of the product (the other being the Brand Commissions page). The Creator Earnings page was the screen the entire creator side of the marketplace would use to verify, in real time, the income they were owed and to trigger withdrawals to their bank account.

> Linear ticket: UAM-445 — Creator Earnings page. Status at the time of the April 10 roadmap snapshot: *In Review*. Priority: **P1 (launch quality)**.

A note worth recording: the April 10, 2026 roadmap explicitly flagged me as a delivery risk — *"Bernardo is out ~1 week. Reassign by April 21 if not back."* That is documented in writing because the creator-side dashboard was on the launch-quality list and there was no easy backfill.

---

## 2. Why the project existed (the problem)

Affiliate marketing is a $32B market (2024) growing toward $48B (2027), and it runs on a structurally broken trust layer. Five concrete failure points were the daily reality the product was designed to fix:

1. **URL parameter stripping** — affiliate tokens dropped by browsers and redirectors.
2. **Cross-device gaps** — click on mobile, convert on desktop, attribution lost.
3. **Ad-blocker interference** — 42% of users block client-side tracking scripts.
4. **Cookie override at checkout** — extensions like Honey replace last-click attribution at the checkout moment.
5. **Session expiry** — Safari caps cookies at 7 days; long consideration cycles disappear.

The market-validating event was the December 2024 **Honey/PayPal exposé**: the YouTuber MegaLag demonstrated that PayPal-owned Honey was systematically replacing creator affiliate cookies at checkout. PayPal had paid $4B for that company. Honey lost ~6M Chrome users within months and a class action seeking $5M+ followed. Microsoft quietly killed its equivalent extension in 2025; Capital One Shopping is in active litigation with a federal CFAA claim proceeding to trial. **19 lawsuits** have been filed against three coupon extensions alone.

Industry numbers used internally for the BD pitch:
- ~$84B lost annually to digital ad fraud (≈22% of global digital ad spend).
- ~$3.5B lost annually to **affiliate** fraud specifically.
- 17% of monthly affiliate commissions lost to fraud.
- 5–10% of affiliate transactions affected by cookie stuffing.
- 11% of commissions lost to link hijacking alone.

The point worth internalizing: **the technical bug and the commercial bug are the same bug.** Whoever sets the last cookie before checkout gets paid, and the party operating the affiliate platform is also the party with the largest economic incentive to under-count. The fix is not better tracking — it is governance.

---

## 3. The technical architecture (what got built)

### Stream A — Attribution engine (Toba) ✅

A Shopify app called **"Attribution"** that brands install via one-click OAuth. The flow:

1. **Influencer link generation** — each publisher gets a unique link `https://ads.uam.app/go/{campaignId}/{publisherAddress}` containing a registered **cryptographic token**, not a guessable UTM.
2. **Click event** — ad-service generates a `clk_<UUID>` click ID, derives a deterministic pseudo-Ethereum address from `keccak256(clickId)`, persists a `UserClickProfile`, then 302-redirects to the Shopify store with `uam_click=<clickId>` plus standard UTM parameters appended.
3. **Conversion** — Shopify fires the `orders/create` webhook to our server; HMAC-verified; idempotency-checked; the `landing_site` is parsed for `uam_click`; the matching `UserClickProfile` is loaded; `recordUserMovementForSeller(...)` and `registerConversion(...)` are called on the UAM Registry contract on Berachain.
4. **Refund** — Shopify fires `refunds/create`; the proportional clawback is computed (`refundAmount / orderTotal × conversionPrice`); `registerReturn(...)` deducts from the publisher's `earned` balance; idempotency guard `AlreadyReturned` blocks duplicate processing.
5. **Withdrawal** — `withdrawRewards()` direct from the publisher wallet; checks `lastConversionTime + returnWindow > block.timestamp`; reverts with `WithdrawalLocked` if the return window hasn't expired.

**Live validation:** April 7, 2026 — confirmed end-to-end on the Barkley Shopify store. Conversion was confirmed on Berascan (block 18358444, Status: Success). Refund flow was proven with idempotency.

The reason **Honey can't beat this**: Honey can override UTM parameters (last-click cookie). It cannot generate a valid cryptographic token registered in our backend. Without a valid registered token, no commission attribution is possible. The token, not the cookie, is the unforgeable credential.

### Stream B — Payment & escrow (Kirsty) 🟡

Originally designed as a fully on-chain commission system. Killed mid-design — twice.
- **Stablecoin depegging risk** — if a creator's $1 became $0.50 due to a depeg event, who absorbs the loss?
- **Zero user benefit** — creators do not know they are touching crypto and do not care.

Kirsty's 9th iteration replaced the entire payment layer with **Stripe** (the same escrow architecture used by Uber and Airbnb): KYC, campaign funding by brands, commission escrow, and direct bank payouts. This collapsed the on-ramp/off-ramp problem in one move.

The chargeback reserve pool (the "self-funding insurance" mechanism) layers on top:
- **Influencer deposit:** `5 × commission_price` covers the first 5 chargebacks.
- **Per-conversion hold:** 30 days post-conversion before split.
- **80/20 split:** 80% to influencer, 20% into a personal reserve pool until the pool covers 20 chargebacks (≈75 successful sales).
- **At ceiling:** 100% to influencer.
- **On chargeback:** deducted from reserve; 80/20 resumes to refill.
- **On exit:** full reserve + deposit returned after all chargeback windows close.

This mechanism is the **product gravity** — it is what makes the platform attractive to brands and influencers independently of warm relationships.

### What's on-chain vs off-chain (final architecture)

| | On-chain (Berachain via Alchemy + UAM contracts) | Off-chain (Stripe / Postgres) |
|---|---|---|
| **Yes** | Campaign creation, conversion records, return records, withdrawal locks | KYC, campaign funding, commission escrow, bank payouts, click profiles, store connections |
| **No** | Money movement of any kind | Anything that needs to be tamper-proof |

The audit surface area for the smart-contract layer dropped dramatically once money was removed from chain. That is a generalizable lesson worth keeping: **only the records that have to be tamper-proof belong on a chain.**

### Frontend (where I worked)

- React/Next.js shell with light mode (dark mode was deliberately removed).
- Static open sidebar.
- A **terminology audit** in flight — replacing "campaign" → "programme" and "advertiser" → "brand" across the UI. This was P0; the old vocabulary signaled an *ad network*, which is the wrong commercial category.
- Reusable **influence cards component (UAM-447)** — technically blocking both the Brand Commissions page (UAM-444) and the Creator Earnings page (UAM-445) I owned.
- An **AI verification spike (UAM-463)** completed by Hiren: pulls audio from YouTube, TikTok, Twitch → Whisper transcription with chunking → Gemini Flash for brand-mention sentiment. Cost per analysis: **$0.0022**. Nobody in the affiliate space was doing automated brand-mention verification at this price point.

---

## 4. The product's value (what makes it actually worth building)

The honest pitch — the one that holds up in front of skeptics — has four parts:

1. **Cryptographic, server-side tokens replace cookies.** Server-to-server attribution is structurally immune to ad blockers, Honey-style overrides, and 7-day Safari caps.
2. **Immutable on-chain records replace opaque dashboards.** The party that owes money does not control the measurement. Disputes stop being he-said/she-said and start being arithmetic.
3. **A self-funding chargeback reserve pool replaces multi-month payout holds.** Influencers don't have to wait 4–7 months for friendly-fraud windows to close. Brands get automatic commission refunds.
4. **Fiat in, fiat out — via Stripe.** Crypto is invisible to the user. The blockchain disappears as UX and survives only as transparency infrastructure.

The category we sat in: not "another tracking tool," but **a neutral measurement authority for commercial transactions between brands and creators.** Roadmap framing called this *governance, not technology*.

The honest claim around accuracy was internally settled at **~85% attribution** (vs. the industry's fictitious 100% claims) — won by patching the leaky funnel, not by lying about the seams.

---

## 5. The challenges (technical and structural)

### Hard technical problems

- **Shopify dev-store password gate** blocked all live testing for weeks. The Barkley live store was the long-running blocker — backend was complete by late March; live validation only landed April 7.
- **Shopify webhook timeout (5s) is shorter than on-chain transaction time (~10s).** This causes Shopify to retry on every conversion and refund. The system has to *self-heal* via idempotency (`AlreadyReturned` and equivalent guards). This is documented as a known design constraint, not a bug. It is a good real-world example of accepting an environmental constraint and engineering around it instead of arguing with it.
- **Cross-device attribution is genuinely unsolved** in V1. The PRD originally claimed cross-device coverage; Toba forced its removal because email-based fallback required a verified-email opt-in that legal/data-sharing constraints made unworkable. *This is one of the rare cases I've seen of a team writing down a feature they wanted, then explicitly un-writing it once it was clear they couldn't deliver it honestly.* Worth remembering as a model.
- **Latency claim revision** — "<5s" became "5–15s" once Stripe escrow operations were sequenced behind the on-chain calls. Engineering pushed back on marketing math and won.
- **Honey override resistance was architecturally sound but never adversarially tested.** The team explicitly softened the public claim from "cannot be overridden" to "structurally resistant" because the experiment to prove it had not been run.

### Structural / org challenges

- **Two Brazilian designers had left** before April. Greg became the only designer for the entire platform — a velocity bottleneck flagged in the Eng Lead Sync.
- **David Flower's last day was April 17, 2026.** Stream B production deployment had to happen *before* he left, with **Juan Carrillo** (new DevOps, also from the Meta Brazil team) onboarded in the same window. There was a hard deadline driven by a single person leaving.
- **A single payment redesign cascaded through 9 iterations** before Kirsty's Stripe-based version stuck. Two of the early ones were architecturally dead — depeg exposure and zero user benefit. Worth recording as a lesson in how often the right answer comes from *deleting scope*, not adding it.
- **Cold start risk** was the dominant strategic concern: a marketplace platform with zero brands and zero creators on day one. Strong technology does not solve a chicken-and-egg problem.

### Things I'd want to be honest about on a CV

- The Creator Earnings page was *In Review* at the snapshot date — meaning shipped to a reviewable state but not yet validated against the full Stripe payout lifecycle.
- The reusable influence-cards component (UAM-447) was a known dependency upstream of my work, and was still in backlog when the roadmap was published — so I was building against a moving foundation.
- I was flagged as a one-week delivery risk (out, possibly to be reassigned). Worth owning rather than glossing over: in a startup-speed context, single-person dependencies are visible and named.

---

## 6. What I'd put on the CV (drafted phrasings)

Pick whichever fits the audience:

**Short, recruiter-facing:**
> Frontend engineer on Freeq Affiliates, a Shopify-native affiliate attribution platform built on a hybrid architecture (off-chain Stripe payments + on-chain Berachain attribution records). Owned the Creator Earnings dashboard — the primary value surface for the creator side of the marketplace, covering escrow, 30-day commission holds, chargeback reserve pool visibility, and Stripe bank payouts.

**Slightly longer, technical:**
> Built creator-facing dashboards in a Next.js application that wired Shopify webhook-driven attribution events (Berachain on-chain conversions and returns, ~10s confirmation latency) to a Stripe-managed escrow lifecycle (`held → released → available → withdrawn`). Worked under a deliberate architectural separation of concerns where the blockchain was scoped exclusively to tamper-proof attribution records and Stripe handled all financial flows — a re-architecture that eliminated stablecoin depeg risk and dramatically reduced the smart-contract audit surface.

**Behavioural / impact:**
> Joined a four-week sprint (March 20 → April 30, 2026) to convert a working backend POC into a launch-ready product. Coordinated frontend delivery against a moving design system (terminology audit + reusable component library being built in parallel) and shipped against a hard external deadline driven by a key engineer's departure date.

### Skills exercised that were genuinely tested
- Next.js / React with TypeScript under strict mode (project guideline).
- Integration with webhook-driven backend systems where idempotency is load-bearing.
- Stripe Connect-style flows: KYC gating, escrow holds, marketplace payouts.
- On-chain integration UX: hiding chain confirmation latency and chain-ish concepts from a non-crypto-native audience.
- Designing for a marketplace where two sides have opposing incentives (brand vs. creator), and the UI has to serve both without making one feel surveilled.
- Working inside a fast-moving spec — the source of truth (Stream A & B Product Scope) was being amended in writing on Google Docs comments by Toba and Kirsty in real time on April 8.

---

## 7. Insights worth keeping (the contemplative part)

A handful of things this project taught me that I want to carry into the next one:

1. **The right architectural decision is often a deletion, not an addition.** Removing crypto from the payment flow is what made the product shippable. The team had to write nine iterations of the chargeback reserve before the right answer (Stripe handles this; chain handles only what must be tamper-proof) became visible.

2. **Pick the boundary that matches the trust model.** On-chain for what *must not* be mutated by either party. Off-chain for everything else. The smart-contract audit surface area drops, the UX gets simpler, and the architecture becomes legible to non-crypto people.

3. **A constraint accepted is faster than a constraint argued with.** The Shopify 5s webhook timeout was not negotiable. The system was redesigned around the certainty that retries would happen, with idempotency as a first-class invariant. Don't argue with the platform you live on.

4. **The honest number sells better than the lying number.** The industry claims 100% attribution accuracy. The team picked 85% and made it the headline. That decision is what makes the rest of the pitch credible.

5. **Governance, not technology.** The interesting startup wedges of the next decade are not "we built a faster X." They are "we sit between two parties whose incentives diverge and we are the trusted third leg of the stool." Frame future work this way when you can.

6. **One person's departure is a deadline.** David Flower leaving April 17 was the real deadline, not April 30. Always map the calendar to the people, not the milestones.

7. **Single-designer pipelines are a structural risk.** When Greg becomes the bottleneck, every frontend ticket is gated on his throughput. If you are the engineer, you can sometimes unblock yourself by doing more design work than feels appropriate. Doing it consciously is better than complaining about it.

---

## 8. Source documents

This artifact synthesizes the following Notion pages from the *UAM Season 3 — Affiliates* teamspace:

- *Freeq Affiliates — Intelligence Brief (Mar 13–27, 2026)* — strategic framing and Mar 26 POC demo recap.
- *Freeq Influencer Affiliate — Stream A & Stream B Product Scope* — canonical PRD, including the full technical breakdown appendix.
- *Freeq Affiliate — Kirsty's Payment Solution: Executive Summary & Scope Update Log* — the Stripe pivot and the April 7 live-store validation.
- *Freeq Affiliate — BD & Sales Notes* — external pitch material, fraud statistics, and competitive landscape.
- *Freeq Affiliates — Product Roadmap (April 2026)* — final priority stack, SWOT, delivery timeline, and the explicit risk note flagging me on UAM-445.

> Compiled May 4, 2026 — for personal reflection and CV use.

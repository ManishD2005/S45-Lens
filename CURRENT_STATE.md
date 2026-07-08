# S45 Lens — Current State (As-Built Inventory)

This document describes exactly what exists in the codebase today. It is not a spec, a roadmap, or a summary of original intent — every claim below is traceable to a specific file. Where something looks like a gap (e.g. no backend, no real auth, opinion content mixed with facts), that's called out plainly rather than smoothed over.

**Architecture in one paragraph:** This is a 100% static frontend prototype — React 19 + TypeScript + Vite + Tailwind v4 + React Router v7. There is no backend, no database, no real authentication, and no real AI/LLM call anywhere in the app. All "data" lives in one file, [src/data/ipos.ts](src/data/ipos.ts), as hardcoded JS objects. All per-browser state (login, saved IPOs, view history, profile) is `localStorage`, managed in [src/lib/appState.tsx](src/lib/appState.tsx). The chatbot is a keyword-matching function reading the same static objects, not a model.

---

## 0. Data model & company roster

- [src/types.ts](src/types.ts) defines the shape of everything. `IpoDetail extends IpoSummary` with ~20 extra fields (verdict text, facts, promoter, peers, fact/read pairs, sources, sample chat, optional `fullReport`, optional `postListing`).
- [src/data/ipos.ts](src/data/ipos.ts) (760 lines) is the **only** data source in the app. It contains:
  - **4 fully-authored companies** with complete `fullReport` blocks: `zappfresh`, `orbit-logistics`, `nimbus-cloud`, `trident-papers` (real-world peer companies were researched for realism, e.g. Avanti Feeds/Godrej Agrovet for Zappfresh, but the figures are approximate/illustrative, not live data).
  - **1 summary-only closed company**: `kaveri-agro` (appears in lists/search but has no detail-tab content beyond the summary card).
  - A `genericIpoDetail(summary)` fallback factory exists in code but is **currently unused** — every slug in `ipoSummaries` is one of the 5 above, so this fallback never actually triggers in practice.
  - `ipoSummaries: IpoSummary[]` — the master list of exactly these 5 companies. Every screen that lists IPOs (Home, Search, Notifications, Upcoming events) reads from this single array. **There is no mechanism to add IPOs other than editing this file.**
  - `applicationHistory: ApplicationRecord[]` — 4 hardcoded records for the Profile screen (Zappfresh applied, Nimbus allotted, Kaveri not-allotted, Trident refunded), independent of any real application flow.
- `IpoDetail.confidenceLabel` (values: `'High confidence'`, `'Mixed signals'`, `'Limited data'`) is defined on every company in the data file but **is never read or rendered anywhere in the UI** (grepped — zero usages outside the type/data file). It's dead data.
- The actual displayed confidence indicator is `StatusTone` (`'high-confidence' | 'mixed-signals' | 'closed'`), rendered via `STATUS_PILL_LABEL`/`STATUS_PILL_STYLE` in [src/lib/ipoFormat.ts](src/lib/ipoFormat.ts) as a 3-value qualitative pill (e.g. "HIGH CONFIDENCE", "MIXED SIGNALS"). **This is a qualitative label, not a numeric score.**

---

## 1. Login — [src/screens/Login.tsx](src/screens/Login.tsx)

**Renders:** Two-step form. Step 1 collects name/email/phone (returning users with a saved `profile` skip straight to phone-only). Step 2 is an OTP field.

**Hardcoded/mock:**
- OTP verification accepts **any 4+ digit input** — the UI literally displays "Prototype — any 4-digit code works."
- No real OTP is sent; there is no SMS/email integration anywhere in the code.
- `EMAIL_PATTERN` regex is the only validation.
- On success, calls `login()` (appState, localStorage-backed) and shows `<WelcomeSplash>` — an animated full-screen greeting ("Good morning/afternoon/evening, {name}") with a count-up of `ipoSummaries.filter(ipo => ipo.isOpen).length` ("N IPOs open right now"), auto-dismissing after ~3.15s.

**Verdict/opinion content:** None.

---

## 2. Home — [src/screens/Home.tsx](src/screens/Home.tsx)

**Scope (explicit answer to the "generic vs. sample companies" question):** Home is **entirely tied to the 5 hardcoded companies** in `ipoSummaries`. It is not a generic/scalable IPO feed — there is no pagination, no backend query, no category filter, no sort control. It is a fixed, hand-authored list rendered client-side.

**Renders, top to bottom:**
1. `<UpcomingEventsRow>` — a horizontally-scrollable/draggable pill strip showing IPO **open/close/listing events falling within the next 4 days**, computed from `getIpoEvents()` in [src/lib/ipoEvents.ts](src/lib/ipoEvents.ts). Dates are **synthetic**: real open/close dates aren't in the data model, only `closesInDays`; actual dates are derived relative to real "today" so the app always looks current no matter when it's opened. Clicking a pill navigates to that IPO.
2. "Popular IPOs on S45 Lens" section — filters `ipoSummaries` to `isOpen: true` only, ranks by a **7-day rolling view count** (`ipoViews` from localStorage, populated by `recordIpoView()` on every IPO Detail visit) as primary sort key and `closesInDays` as tiebreaker, then **slices to top 3**. If localStorage has no view history yet, this degenerates to closest-to-closing-first.
3. Each result renders as an `<IpoCard>` (see §9). A "View more" link goes to Search.
4. If zero open IPOs exist, shows a plain "No open IPOs right now." message.

**Verdict/opinion content:** None directly on Home — but each `IpoCard` shows the same category/status pill described in §9, and clicking through leads to opinion content on the detail tabs.

---

## 3. Search Results — [src/screens/SearchResults.tsx](src/screens/SearchResults.tsx)

**Renders:** Client-side substring filter over `ipoSummaries` (matches against `name`, `category`, `oneLiner` — no fuzzy matching, no backend). Open-status results render as `<IpoCard>`; closed-status results render as a dimmed inline row instead. Empty query shows `<SearchSuggestions>` (a static list of prompts/recent searches from localStorage).

**Hardcoded/mock:** 100% client-side array filter; "search" is really just `Array.filter` over the same 5-company array used everywhere else.

**Verdict/opinion content:** Same `IpoCard` pills as Home/Search — see §9.

---

## 4. IPO Detail — shell — [src/screens/IpoDetail.tsx](src/screens/IpoDetail.tsx)

**Renders:** A sidebar (`<aside>`) with logo/monogram, `shortName`, `oneLiner`, a dynamic countdown string (`getIpoCountdownText()` → "Closes in N days" / "Opens in N days" / "Closed" / "Listed | +X%"), the listed price or minimum investment, and Save/Share buttons. **No category/status tag exists in the sidebar** — those pills only appear inside the Summary tab now.

Tab bar: `Summary`, `Deep dive`, `Peers`, `Transparency`, `Full Report` (all 5 exist and are wired up; none are stubs). `<ChatWidget ipo={ipo}>` is always mounted as a floating element regardless of active tab. `recordIpoView(slug)` fires once on mount, feeding Home's popularity ranking.

---

## 5. Summary tab — [src/screens/ipoDetail/SummaryTab.tsx](src/screens/ipoDetail/SummaryTab.tsx)

**Section 1 — "S45 Lens verdict"** (⚠️ **explicit opinion/judgment content**):
- A card containing a category pill (dark grey, uppercase) + the `StatusTone` pill described above, then `<h2>{ipo.verdictHeadline}</h2>` and `<p>{ipo.verdictBody}</p>`.
- Both `verdictHeadline` and `verdictBody` are authored opinion text per company in `ipos.ts` (e.g. this is a judgment call about the IPO, not a neutral fact restatement). **This is the single most direct "verdict" element in the app** — it does not use Subscribe/Avoid wording, but it is an evaluative headline+paragraph judgment, always visible (not gated) in the current build.

**Section 2 — "Top 3 facts that matter":** `ipo.topFacts.map(fact => <FactRow>)` — tone-colored (success/warning/danger) icon + text + an info-icon popover showing `fact.source`. Purely factual framing, each fact has a citation.

**Section 3 — "Since listing"** (conditional on `isIpoListed(ipo)`): current price, `+/−X%` vs. issue price, and if `postListing.updates[0]` exists, a "Latest: {title}" button that jumps to Full Report.

**Footer:** "View full research report" link (only if `ipo.fullReport` exists) + `<VerifiedSourcesNote>` — hover(desktop)/tap(mobile) element reading "Verified against {verifiedSourceCount} independent sources", revealing a popover of `sourcesChecked` pills.

---

## 6. Deep Dive tab — [src/screens/ipoDetail/DeepDiveTab.tsx](src/screens/ipoDetail/DeepDiveTab.tsx)

**"Business model"** section (tagged `<PhaseTag variant="fact">` = solid green "From the DRHP" pill): 3-column card grid — "How they make money" (`ipo.howTheyMakeMoney`), "What they do" (`ipo.oneLiner`), "Their edge" (`ipo.strengths[0]`, or a fallback string if empty).

**"Use of proceeds"** section (same fact pill): the original one-sentence summary (`ipo.useOfProceeds`, unchanged text) plus a **donut chart** (`UseOfProceedsDonut`, Recharts `PieChart`) rendering `ipo.useOfProceedsBreakdown` — every bucket the company actually discloses (capex/working capital/GCP/issue expenses, varies per company; e.g. Trident Papers has only 3 buckets, not padded to match others). Palette: `#055D56` (largest slice), `#1CBDB1`, then muted greys `#61686F`/`#9AA1A8`/`#C7CBCE`. Percentage labels render on/adjacent to slices plus a legend list with percentages. **Fully data-driven** — bucket count/labels/proportions come entirely from each company's data, nothing is invented to hit a fixed count.

**"Strengths & risks"** (conditional, only if either list is non-empty): a toggle between full uncapped Strengths/Risks lists (filled thumbs-up/down icons). Caption: **"Strengths from the DRHP · Risks ranked by S45's read."** — ⚠️ this explicitly flags risks as S45's own ranking/judgment, not a neutral list.

**"Promoter & governance":** name, `holdingPct`, `context`, optional `background` bio line, optional pre-issue→post-issue dilution %, and if listed, a post-issue→current holding trend tagged "From exchange filings". Optional `notableAffiliation` warning-styled callout — **currently populated only for Orbit Logistics** (a struck-off group company disclosure) — everyone else has no callout since the field is empty in their data.

---

## 7. Peers tab — [src/screens/ipoDetail/PeersTab.tsx](src/screens/ipoDetail/PeersTab.tsx)

**Renders:** A P/E bar chart (`ipo.peers`, subject company highlighted in brand green `#055D56` vs. grey peers), tagged with the same fact pill. Below it, conditional on `ipo.fullReport.extendedPeers` existing: three `StatPairRow`s ("Return on net worth", "Revenue scale", "Revenue growth" — each "This IPO X vs. peer median Y", median computed client-side via a local `median()` helper over the peer array).

**"S45's read" card** (⚠️ opinion-labeled): `peerComparisonSummary()` generates a sentence like *"{Company} is priced lower than N of M peers on P/E."* — rendered inside `<InfoCard variant="read" label="S45's read">`. Note: the underlying claim is a **mechanical arithmetic comparison** (count of peers with higher P/E), not a subjective judgment — but it is presented under the "S45's read" opinion label regardless.

---

## 8. Transparency tab — [src/screens/ipoDetail/TransparencyTab.tsx](src/screens/ipoDetail/TransparencyTab.tsx)

**"Fact vs. S45's read"** (⚠️ the app's clearest fact/opinion pairing): `ipo.factReadPairs.map(pair)`, each rendered as two side-by-side cards — `<InfoCard variant="fact" label="From the DRHP">{pair.fact}</InfoCard>` and `<InfoCard variant="read" label="S45's read">{pair.read}</InfoCard>`. The `.read` strings are explicit subjective opinion text authored in `ipos.ts` (e.g. "Genuinely strong — growth and profitability improving together", "A single lost contract would leave a visible dent").

**"Lead manager track record"** (conditional on `ipo.leadManager`): tagged "From exchange filings" (not "From the DRHP"). Shows `"{belowIssuePriceCount} of {totalIssues} issues ({pct}%) closed below issue price on listing day."` and a button to jump to the full list in Full Report. This is a factual track-record statistic, not framed as an opinion.

**"Sources checked":** pills from `ipo.sourcesChecked`.

**"How we verify"** (collapsed by default, expandable): a static `METHODOLOGY` map (keyed by source string: DRHP/RHP, MCA filings, SEBI orders, Litigation records, Exchange filings) explaining what each check means in the real product, filtered to only the sources this IPO actually has.

**Static disclosure footer:** *"Facts are AI-drafted from primary filings and reviewed by an S45 analyst before publishing. The read/verdict content is gated behind SEBI Research Analyst registration in the real product."* — ⚠️ this line itself acknowledges that "read/verdict" content is opinion-category content requiring regulatory gating in a real deployment, but **in the current prototype build it is NOT gated — it renders unconditionally for every visitor.**

---

## 9. Full Report tab — [src/screens/ipoDetail/FullReportTab.tsx](src/screens/ipoDetail/FullReportTab.tsx)

Shows a "not yet available" placeholder if `ipo.fullReport` is undefined (never happens for the 4 fully-authored companies; would happen for `kaveri-agro` or any unauthored slug). All ~13 sections use a shared `Section` wrapper that renders a `<PhaseTag variant="fact">` pill in the header (defaults to "From the DRHP", overridden to "From exchange filings" for post-listing sections) — so every Full Report section is fact-tagged; **there is no opinion/"S45's read" content anywhere in this tab.**

Sections, in order: Issue mechanics (KeyValueGrid) → Use of proceeds breakdown (table, conditional on non-empty buckets) → Full timeline (computed dates via `getIpoFullTimeline()`, or a "not applicable" message if the IPO is closed) → Application tiers table → Allocation & anchor details (subscription table + anchor investor card) → Capital history (table + a computed promoter-acquisition-cost-vs-issue-price caption) → Full financials multi-year table → Valuation ratios (12-item KeyValueGrid) → Extended peer comparison table → Lead manager & registrar (repeats the same below-issue-price stat as Transparency, plus registrar name) → Contingent liabilities & borrowings (two tables) → Official source links (label + note rows — **explicitly not real clickable URLs**, with the caption "Reference categories shown for this prototype — the production app links directly to each filing.") → conditionally, if listed: Post-listing shareholding & insider activity + Material company updates (both "From exchange filings") → Frequently asked questions (`buildFaqs()` generates ~5 Q&As computed live from the same `fullReport` fields used elsewhere in the tab and mirrored by the chatbot's keyword branches, by design, so they can't drift out of sync).

**Verdict/opinion content:** None — this tab is deliberately all-fact, all-sourced.

---

## 10. Profile / Settings — [src/screens/Profile.tsx](src/screens/Profile.tsx)

**Renders:**
- `profile` (name/phone/email) from localStorage via appState.
- "Saved IPOs" — `ipoSummaries` filtered by `savedSlugs` (localStorage).
- "Application history" — the 4 **hardcoded** `applicationHistory` records from `ipos.ts` (Zappfresh applied, Nimbus allotted, Kaveri not-allotted, Trident refunded, with hardcoded display dates like `'28 Jun 2026'`). This is not driven by any real application flow — there is no "apply" action anywhere in the app that would generate a new record.
- An expandable `SETTINGS_ROWS` list, 3 static rows:
  1. "Notification preferences" (no real content beyond a placeholder).
  2. **"How S45 is compensated"** — static text: *"S45 may earn a fee from lead managers when you apply to an IPO through the platform. This does not change the plain-language facts or their sourcing."*
  3. **"Disclaimers & legal"** — static text: *"Content on S45 Lens is for informational purposes and is not investment advice. Verdicts and risk rankings are opinions, gated behind SEBI Research Analyst registration in the live product. Always read the official DRHP before applying."* ⚠️ Same as the Transparency tab disclaimer — this text claims verdicts/risk rankings are "gated" in the live product, but **no such gating exists in the current build**; the Summary tab's verdict and Deep Dive's ranked risks render unconditionally for every user.
- Logout button (clears localStorage login state).

**Verdict/opinion content:** No new verdict content generated here, but it surfaces/links to the same verdict-bearing IPOs via "Saved IPOs".

---

## 11. Notifications — [src/components/NotificationsMenu.tsx](src/components/NotificationsMenu.tsx)

A bell-icon dropdown (desktop only, `hidden sm:flex`) showing at most two static-derived rows: the single open IPO closing soonest (from `ipoSummaries`), and the single most recent entry in the hardcoded `applicationHistory`. No real push/notification system — this is a computed dropdown, not a notification feed with history.

---

## 12. Chatbot — [src/components/ChatPanel.tsx](src/components/ChatPanel.tsx) + [src/lib/mockChat.ts](src/lib/mockChat.ts)

**Renders:** A floating chat bubble → mobile bottom-sheet or desktop floating panel, scoped to one IPO at a time (footer caption: *"Scoped to {ipo.name} only"*). Seeds from `ipo.sampleChat`. `SUGGESTED_QUESTIONS` = "What are the biggest risks?", "Where does the money raised go?", "Who is the promoter?" (filtered to hide already-asked ones).

**How replies work — ⚠️ no AI/LLM is involved:** `mockAssistantReply(question, ipo)` in [src/lib/mockChat.ts](src/lib/mockChat.ts) is a pure keyword-matching function over the same static `ipo` object used everywhere else, wrapped in a `setTimeout(700ms)` to *simulate* typing latency. There is no network call, no model API, nothing non-deterministic.

**Built-in refusal mechanism (⚠️ directly relevant to "Subscribe/Avoid" flagging):** `ADVICE_TRIGGERS = ['should i invest', 'should i apply', 'worth buying', 'is it a buy', 'guaranteed']` (plus "invest"+"should" both present) short-circuits to a fixed refusal: *"I can only help you understand verified facts about {ipo.name} — I can't tell you whether to invest. Try asking about revenue growth, risks, use of proceeds, or the promoter."* **The chatbot is explicitly built to refuse Subscribe/Avoid-style recommendation requests — this is the one place in the app that actively defends against giving investment advice**, in contrast to the Summary tab's verdict and Transparency's "S45's read" pairs, which do carry evaluative language without a refusal gate.

Other branches answer factual lookups (price band, lot size, listing date, P/E, face value — mirroring the Full Report FAQ) and topic lookups (concentration risk, debt/tax, revenue growth, promoter, use of proceeds, risk) by searching `ipo.topFacts`/`ipo.risks`/etc. for a matching entry. Fallback for anything unmatched: *"I don't have a verified answer for that yet in {ipo.name}'s DRHP…"*

---

## 13. Shared components worth flagging

- **`PhaseTag`** ([src/components/PhaseTag.tsx](src/components/PhaseTag.tsx)) — the shared "fact" pill (solid green, "From the DRHP" by default, overridable label) and "read" pill (dashed border, "S45's read"). One component, reused across Deep Dive, Peers, Transparency, and every Full Report section — a single edit here changes the visual language app-wide.
- **`InfoCard`** ([src/components/InfoCard.tsx](src/components/InfoCard.tsx)) — `variant: 'fact' | 'read'`; solid-border fact cards vs. dashed-border opinion cards. This fact/opinion visual contrast is explicitly taught to first-time users in `FirstRunExplainer.tsx`'s onboarding copy (shown once, gated by an `introSeen` localStorage flag).
- **`IpoCard`** ([src/components/IpoCard.tsx](src/components/IpoCard.tsx)) — used on Home/Search/Profile. Shows category tag + `StatusTone` pill (High confidence / Mixed signals / Closed), oneLiner, countdown text, price. No verdict text on the card itself — that only appears after opening the IPO's Summary tab.

---

## Summary answer to the four questions asked

1. **Data/content per screen:** enumerated in full above, section by section.
2. **Hardcoded vs. data-model-driven:** *Everything* is ultimately "hardcoded" in the sense that all data lives in one static file ([src/data/ipos.ts](src/data/ipos.ts)) with no backend — but within that file, most UI is driven generically off the `IpoDetail`/`FullReportData` schema (donut charts, tables, FAQs, timelines are all computed from data, not copy-pasted per company). The exceptions that are truly one-off/hardcoded regardless of schema: `applicationHistory` (Profile), the Settings disclaimer/compensation text, and `notableAffiliation` (only populated for one company).
3. **Verdict/opinion/judgment content, exhaustively:**
   - Summary tab: **"S45 Lens verdict"** headline + body (unconditional, not gated).
   - Deep Dive: **"Risks ranked by S45's read"** caption on the Strengths/Risks toggle.
   - Peers tab: **"S45's read"**-labeled `InfoCard` with the peer-pricing sentence.
   - Transparency tab: **"Fact vs. S45's read"** paired cards (the clearest and most numerous opinion content in the app) + a disclosure claiming verdicts are gated by SEBI registration (**not actually enforced in this build**).
   - Profile/Settings: a disclaimer repeating the same "gated in the live product" claim.
   - Chatbot: explicitly **refuses** Subscribe/Avoid-style requests via `ADVICE_TRIGGERS` — the one place that actively guards against giving a recommendation rather than merely labeling one.
   - No numeric confidence score exists anywhere in the rendered UI (`confidenceLabel` is dead data); the only confidence-like signal is the 3-value qualitative `StatusTone` pill.
4. **Home screen scope:** tied exclusively to the 5 hardcoded companies in `ipoSummaries` — not a generic or scalable IPO listing. Adding a 6th real IPO today would require manually editing `src/data/ipos.ts`.

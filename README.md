# LessonHub — Entrepreneurship Platform

> A production-grade Next.js platform for storing, reading, and annotating entrepreneurship frameworks — built for founders, students, and operators who want systematic venture knowledge instead of generic startup advice.

🔗 **Live:** https://entrepreneurship-platform.vercel.app

📦 **Repo:** https://github.com/neagsom229-lang/entrepreneurship-platform

---

## Why This Exists

Most entrepreneurship content online is either:

- **Too shallow** — motivational threads, listicles, "10 habits of successful founders"
- **Too academic** — dense textbooks that never touch operational reality
- **Too scattered** — useful advice buried inside podcasts, Twitter threads, and paywalled courses

**LessonHub** solves this by curating 13 structured, operator-grade frameworks — one per venture category — into a single distraction-free workspace. Every document is built with:

- **Worked math** — real formulas with numbered examples (LTV/CAC, Burn Multiple, SAFE dilution)
- **Real-world case studies** — Datadog, Casper, Snowflake, Theranos, GitLab, Fast, Figma, Airbnb
- **Failure modes** — where the framework breaks and why
- **Action checklists** — 5–7 things to do this week
- **Real citations** — The Mom Test, Venture Deals, Amp It Up, Zero to One, YC SAFE Primer, NVCA model docs

No signup. No paywall. No fluff.

---

## What It Does

### 📚 Document Library

- 13 frameworks across 13 venture categories
- Search by keyword, concept, or tag
- Filter by category, difficulty, and multi-select tags
- Sort by newest, oldest, read time, alphabet, or difficulty
- Grid and list view modes
- Progress rings on started/completed docs

### 📖 Reader Workspace

- Full Markdown rendering (headings, tables, code, checkboxes, blockquotes)
- Auto-generated Table of Contents with active-section highlighting
- Reading progress bar + "X min left" estimate
- Font family toggle (sans / serif) and size control (S / M / L)
- Inline notes drawer (per-document)
- Bookmarks with persistence
- Copy link to share
- Related documents at the bottom

### ✍️ Author Workspace

- Two-column writer layout (form + live preview sidebar)
- Live-computed word count and read time
- Dynamic learning objectives list
- Tag pills with add/remove
- Real-time library card preview
- Inline field validation with progress bar
- Full Markdown editor with preview toggle

### 🎯 Dashboard

- Total library count
- Bookmarked frameworks
- Notes captured
- Completed documents
- Resume reading section
- Recently viewed docs

### 🎨 Design

- Dark and light mode
- Responsive across mobile, tablet, and desktop
- Consistent design tokens (indigo + slate)
- Professional SaaS-grade landing page with hero carousel
- Accessible (ARIA labels, semantic HTML, keyboard shortcuts)

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v3 + `@tailwindcss/typography` + custom design tokens |
| **Icons** | lucide-react |
| **Animation** | framer-motion |
| **Markdown** | react-markdown + remark-gfm |
| **Math & code** | KaTeX (remark-math + rehype-katex), react-syntax-highlighter |
| **State** | Zustand with localStorage persistence |
| **Utilities** | zod (validation), sonner (toasts), clsx + tailwind-merge |
| **Fonts** | Inter (sans) + system serif stack |
| **Deployment** | Vercel (auto-deploy on push to `main`) |

---

## Getting Started

### Prerequisites

- Node.js 18.17+ (required by Next.js 14)
- npm

### Install

```bash
git clone https://github.com/neagsom229-lang/entrepreneurship-platform.git
cd entrepreneurship-platform
npm install
```

### Run Locally

```bash
npm run dev
```

Open http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```text
src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Sidebar + navbar wrapper
│   │   ├── dashboard/page.tsx      # Stats, resume reading, bookmarks
│   │   ├── documents/
│   │   │   ├── page.tsx            # Library with filters, sort, tags
│   │   │   └── [id]/page.tsx       # Reader with TOC, notes, related
│   │   └── upload/page.tsx         # Author workspace
│   ├── page.tsx                    # Landing page with carousel
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Design tokens + Tailwind
├── components/
│   └── layout/
│       ├── sidebar.tsx             # Collapsible navigation
│       ├── navbar.tsx              # Search + theme toggle + breadcrumbs
│       └── mobile-nav.tsx          # Full-screen mobile menu
├── lib/
│   ├── mock-data.ts                # 13 seed documents
│   └── utils.ts                    # cn() helper
├── store/
│   └── use-app-store.ts            # Zustand store with persistence
└── types/
    └── index.ts                    # Category, Difficulty, DocumentItem, Note
```

---

## The 13 Frameworks

| # | Title | Category |
|---|-------|----------|
| 1 | Systematic Problem Discovery & The Hair-on-Fire Framework | Ideation |
| 2 | Operational Customer Discovery: Extracting Truth from Prospect Interviews | Market Research |
| 3 | Unit Economics Architecture: LTV, CAC, and Contribution Margins | Business Model |
| 4 | B2B Go-To-Market & Demand Architecture: Zero to $1M ARR | Marketing |
| 5 | Enterprise Pipeline Qualification: The MEDDPICC Framework | Sales |
| 6 | Financial Modeling for Venture: Runway, Burn, and Growth Capital | Finance |
| 7 | Foundations of Startup Law: Equity Vesting, Cap Tables, IP | Legal |
| 8 | Seed Fundraising Mechanics: Post-Money SAFEs, Caps, Dilution | Fundraising |
| 9 | Hiring the First Ten: Equity, Role Definition, Trial Projects | Team |
| 10 | Operating Rhythm Architecture: Written Async Systems | Operations |
| 11 | Product-Led Growth Mechanics: Activation Loops, TTV, Virality | Growth |
| 12 | The Institutional Pitch Deck: Slide Sequence, Narrative Arc | Pitch Deck |
| 13 | The Series Seed Term Sheet: Audit Checklist & Protective Provisions | Templates |

Each document includes:

- ✅ Learning objectives (3–4)
- ✅ Prerequisites
- ✅ Framing section (why the framework exists)
- ✅ Comparison tables
- ✅ Worked formulas with real numbers
- ✅ Two contrasting real case studies (success + failure)
- ✅ Boundary conditions (where it breaks)
- ✅ Steelman counterargument
- ✅ Common pitfalls
- ✅ Key takeaways
- ✅ Action checklist (5–7 items)
- ✅ Reference bibliography

---

## Design Principles

- **Density over padding** — 20K+ words across 13 frameworks, every sentence earns its place
- **Real over hypothetical** — named companies, dated events, published sources
- **Failure modes over hype** — every framework shows how it breaks
- **Local-first** — notes, bookmarks, and progress persist in the browser, no account required
- **Zero friction** — open the app, start reading, no onboarding

---

## Roadmap

### ✅ Shipped

- [x] 13-document library with search and filters
- [x] Reader with markdown, notes, bookmarks, progress
- [x] Author workspace with live preview
- [x] Dashboard with stats
- [x] Dark/light mode
- [x] Landing page with carousel
- [x] Responsive mobile navigation
- [x] Auto-generated TOC in reader
- [x] Related documents
- [x] Multi-select tag filter + sort options

### 🚧 Planned

- [ ] Supabase auth (magic link + OAuth)
- [ ] Cloud persistence for cross-device sync
- [ ] Admin upload for new documents
- [ ] Reading streak tracking
- [ ] Weekly progress charts
- [ ] Per-document SEO metadata
- [ ] JSON-LD structured data
- [ ] Sitemap + robots.txt
- [ ] Vercel Analytics integration
- [ ] Full-text search across content body

---

## Performance

Production build metrics (from Vercel, at time of writing):

| Route | First Load JS | Type |
|-------|---------------|------|
| `/` | 99.7 kB | Static |
| `/dashboard` | 166 kB | Static |
| `/documents` | 166 kB | Static |
| `/documents/[id]` | 211 kB | Dynamic |
| `/upload` | 158 kB | Static |
| Shared baseline | 87.3 kB | — |

---

## Contributing

This is a personal learning project, but suggestions are welcome. If you spot an incorrect statistic or a citation that doesn't check out, please [open an issue](https://github.com/neagsom229-lang/entrepreneurship-platform/issues) — factual accuracy matters more than polish here.

---

## License

MIT — see [LICENSE](./LICENSE). Use it, fork it, adapt it; just keep the copyright and license notice.

---

## Acknowledgments

Frameworks and case studies reference the following works:

- *The Mom Test* — Rob Fitzpatrick (2013)
- *Venture Deals* — Brad Feld & Jason Mendelson (4th ed., 2019)
- *Zero to One* — Peter Thiel with Blake Masters (2014)
- *Working Backwards* — Colin Bryar & Bill Carr (2021)
- *Amp It Up* — Frank Slootman (2022)
- *High Output Management* — Andrew Grove (1983)
- *Why Startups Fail* — Tom Eisenmann (2021)
- *Obviously Awesome* — April Dunford (2019)
- *Traction* — Gabriel Weinberg & Justin Mares (2014)
- *The Qualified Sales Leader* — John McMahon (2021)
- *Product-Led Growth* — Wes Bush (2019)
- *Secrets of Sand Hill Road* — Scott Kupor (2019)
- Y Combinator, *Post-Money SAFE User Primer* (2018)
- NVCA *Model Legal Documents*

Plus primary-source case studies from SEC S-1 filings (Datadog, Casper, GitLab, Snowflake, Box) and investigative reporting (*Bad Blood* by John Carreyrou, 2018).

---

Built by Chheangsamnang — as i have summary researching and operators who want to execute, not just read.
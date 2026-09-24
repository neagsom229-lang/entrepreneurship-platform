'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Compass,
  FileCheck2,
  Zap,
  Target,
  TrendingUp,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Moon,
  Sun,
  BookMarked,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';

/* ---------------------------------- DATA ---------------------------------- */

const SLIDES = [
  {
    badge: 'Curated Knowledge Base for Founders',
    title: 'Venture knowledge,',
    highlight: 'ready to execute',
    subtitle:
      'Systematic frameworks on ideation, customer validation, unit economics, pitch architecture, and governance — in one distraction-free workspace.',
    primaryCta: { label: 'Explore Frameworks', href: '/documents', icon: BookOpen },
    secondaryCta: { label: 'Open Dashboard', href: '/dashboard' },
    icon: Sparkles,
  },
  {
    badge: '13 Categories · 20K+ Words',
    title: 'From first idea to',
    highlight: 'signed term sheet',
    subtitle:
      'A structured curriculum covering Ideation, Market Research, Business Model, Marketing, Sales, Finance, Legal, Fundraising, Team, Operations, Growth, Pitch Deck, and Templates.',
    primaryCta: { label: 'Browse Categories', href: '/documents', icon: Compass },
    secondaryCta: { label: 'See Dashboard', href: '/dashboard' },
    icon: Compass,
  },
  {
    badge: 'Read · Annotate · Apply',
    title: 'Built for operators who',
    highlight: 'ship fast',
    subtitle:
      'Bookmark frameworks, take inline notes, track reading progress, and switch typography to match your focus. Everything persists locally.',
    primaryCta: { label: 'Start Reading', href: '/documents', icon: Zap },
    secondaryCta: { label: 'Upload Your Own', href: '/upload' },
    icon: Zap,
  },
];

const SOURCES = [
  'The Mom Test',
  'Venture Deals',
  'Zero to One',
  'Working Backwards',
  'Amp It Up',
  'High Output Management',
];

const STATS = [
  { value: '13', label: 'Core Frameworks' },
  { value: '20K+', label: 'Words of Content' },
  { value: '100%', label: 'Free & Open' },
  { value: '0', label: 'Accounts Required' },
];

const FEATURES = [
  {
    icon: Compass,
    title: '13 Core Categories',
    desc: 'From zero-to-one validation through institutional Series A term-sheet negotiations.',
  },
  {
    icon: FileCheck2,
    title: 'Focused Reader Workspace',
    desc: 'Custom typography, scroll progress, inline notes, and bookmarks in a distraction-free layout.',
  },
  {
    icon: ShieldCheck,
    title: 'Local Persistence',
    desc: 'Notes, bookmarks, and reading position saved locally. No account required to get started.',
  },
  {
    icon: TrendingUp,
    title: 'Real Frameworks Only',
    desc: 'LTV/CAC, MEDDPICC, Post-Money SAFEs, Burn Multiple — the same tools venture funds use.',
  },
];

const CATEGORIES = [
  'Ideation',
  'Market Research',
  'Business Model',
  'Marketing',
  'Sales',
  'Finance',
  'Legal',
  'Fundraising',
  'Team',
  'Operations',
  'Growth',
  'Pitch Deck',
  'Templates',
];

const STEPS = [
  {
    step: '01',
    title: 'Pick a framework',
    desc: 'Browse by category or search across all 13 modules. Filter by difficulty to match your stage.',
  },
  {
    step: '02',
    title: 'Read & annotate',
    desc: 'Toggle typography, take inline notes, bookmark sections, and track scroll progress automatically.',
  },
  {
    step: '03',
    title: 'Apply & track',
    desc: 'Resume reading from where you left off. Notes and bookmarks persist across sessions.',
  },
];

const FAQS = [
  {
    q: 'Is LessonHub really free?',
    a: 'Yes. Every framework, note, and bookmark is available without payment. No account, no signup, no paywall.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No. All data — notes, bookmarks, reading progress — persists locally in your browser. Nothing leaves your device.',
  },
  {
    q: 'What makes this different from other startup content?',
    a: 'Every document is a structured module with worked math, real case studies, failure modes, and 7-day action checklists — not opinion essays.',
  },
  {
    q: 'Can I upload my own documents?',
    a: 'Yes. Use the Upload page to author Markdown frameworks, add tags, set difficulty, and store them in your local library.',
  },
  {
    q: 'Are the sources verified?',
    a: 'Yes. Every citation references a real published book, statutory code, S-1 filing, or named industry report. No fabricated statistics.',
  },
  {
    q: 'Can I use this on mobile?',
    a: 'Absolutely. Every page is responsive, with mobile-optimized navigation, reader controls, and notes drawer.',
  },
];

/* -------------------------------- COMPONENT -------------------------------- */

export default function LandingPage() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const { isDarkMode, toggleTheme } = useAppStore();

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 6500);
    return () => clearInterval(id);
  }, [next, paused]);

  const slide = SLIDES[index];
  const SlideIcon = slide.icon;
  const PrimaryIcon = slide.primaryCta.icon;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ================= HEADER ================= */}
      <header className="border-b px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full sticky top-0 z-40 bg-background/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-lg">
            E
          </div>
          <span className="font-bold text-base tracking-tight">LessonHub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <Link href="/documents" className="hover:text-foreground transition-colors">Frameworks</Link>
          <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <Link href="/upload" className="hover:text-foreground transition-colors">Upload</Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            href="/dashboard"
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5"
          >
            Go to App <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ================= HERO (TWO-COLUMN) ================= */}
      <section
        className="relative max-w-7xl mx-auto w-full px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Left: Slideshow text */}
        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex flex-col"
            >
              <div className="inline-flex self-start items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-6">
                <SlideIcon className="w-3.5 h-3.5" /> {slide.badge}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.05]">
                {slide.title}{' '}
                <span className="text-primary underline decoration-primary/30 underline-offset-8">
                  {slide.highlight}
                </span>
                .
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
                {slide.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Link
                  href={slide.primaryCta.href}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <PrimaryIcon className="w-4 h-4" /> {slide.primaryCta.label}
                </Link>
                <Link
                  href={slide.secondaryCta.href}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg border bg-card hover:bg-muted font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {slide.secondaryCta.label}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slideshow controls */}
          <div className="flex items-center gap-4 mt-12">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="w-9 h-9 rounded-full border bg-card hover:bg-muted flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next slide"
              className="w-9 h-9 rounded-full border bg-card hover:bg-muted flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Product mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative"
        >
          <ProductMockup />
        </motion.div>
      </section>

      {/* ================= SOURCES STRIP ================= */}
      <section className="border-y bg-card/30">
        <div className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
            <BookMarked className="w-3.5 h-3.5" />
            Built on proven frameworks from
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-3 text-sm font-semibold text-muted-foreground/70">
            {SOURCES.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATS BAR ================= */}
      <section className="border-b bg-card/40">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {STATS.map((s) => (
            <div key={s.label} className="py-8 px-4 text-center">
              <div className="text-3xl font-extrabold tracking-tight text-foreground">
                {s.value}
              </div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-6xl mx-auto w-full px-6 py-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-card text-muted-foreground text-xs font-semibold mb-4">
            <Target className="w-3.5 h-3.5" /> Why LessonHub
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Built for founders who ship
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Not another content library. A structured operator&apos;s workspace for venture execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="p-6 rounded-2xl border bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="border-t bg-card/20">
        <div className="max-w-6xl mx-auto w-full px-6 py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-card text-muted-foreground text-xs font-semibold mb-4">
                <Users className="w-3.5 h-3.5" /> The Curriculum
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                13 categories. One operating system.
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg">
                Every category is a self-contained module with worked math, real case studies,
                failure modes, and action checklists.
              </p>
            </div>
            <Link
              href="/documents"
              className="self-start md:self-end text-sm font-semibold text-primary hover:underline flex items-center gap-1 shrink-0"
            >
              Browse all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat}
                href="/documents"
                className="p-4 rounded-xl border bg-card hover:border-primary/40 hover:bg-primary/[0.02] transition-all flex items-center gap-3 group"
              >
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-xs font-semibold truncate">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="max-w-6xl mx-auto w-full px-6 py-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-card text-muted-foreground text-xs font-semibold mb-4">
            <CheckCircle2 className="w-3.5 h-3.5" /> How it works
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Three steps to execution
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            No sign-up. No configuration. Open the library and start.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div key={s.step} className="relative p-6 rounded-2xl border bg-card/50">
              <div className="text-4xl font-black text-primary/15 mb-3">{s.step}</div>
              <h3 className="font-bold text-sm mb-2">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="border-t bg-card/20">
        <div className="max-w-3xl mx-auto w-full px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Frequently asked questions
            </h2>
            <p className="text-sm text-muted-foreground">
              Everything you need to know about LessonHub.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={faq.q}
                  className="rounded-xl border bg-card overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-xs text-muted-foreground leading-relaxed">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="max-w-5xl mx-auto w-full px-6 py-20">
        <div className="rounded-3xl border bg-gradient-to-br from-primary/5 via-card to-card p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_60%)] pointer-events-none" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Ready to execute?
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-8">
              Open the library, pick a framework, and start reading. No signup, no paywall, no fluff.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/documents"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <BookOpen className="w-4 h-4" /> Explore Frameworks
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 py-3 rounded-lg border bg-card hover:bg-muted font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t bg-card/30">
        <div className="max-w-6xl mx-auto w-full px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-sm">
              E
            </div>
            <span className="font-bold text-sm">LessonHub</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/documents" className="hover:text-foreground transition-colors">
              Frameworks
            </Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/upload" className="hover:text-foreground transition-colors">
              Upload
            </Link>
          </div>

          <p className="text-xs text-muted-foreground text-center md:text-right">
            © {new Date().getFullYear()} LessonHub · Built for founders, mentors, and operators.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------ PRODUCT MOCKUP ------------------------------ */

function ProductMockup() {
  return (
    <div className="relative">
      {/* Glow */}
      <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-3xl rounded-3xl pointer-events-none" />

      {/* Browser frame */}
      <div className="relative rounded-xl border bg-card shadow-2xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/40">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
          </div>
          <div className="flex-1 mx-3">
            <div className="px-2.5 py-1 rounded-md bg-background border text-[10px] text-muted-foreground font-mono truncate">
              lessonhub.app/documents/unit-economics
            </div>
          </div>
        </div>

        {/* App body */}
        <div className="flex">
          {/* Mini sidebar */}
          <div className="hidden sm:flex flex-col w-40 border-r bg-muted/20 p-3 gap-1.5">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-primary-foreground font-black text-[10px]">
                E
              </div>
              <span className="text-[10px] font-bold">LessonHub</span>
            </div>
            <div className="px-2 py-1.5 rounded-md bg-primary/10 text-primary text-[10px] font-semibold flex items-center gap-1.5">
              <BookOpen className="w-3 h-3" /> Library
            </div>
            <div className="px-2 py-1.5 rounded-md text-muted-foreground text-[10px] flex items-center gap-1.5">
              <Compass className="w-3 h-3" /> Dashboard
            </div>
            <div className="px-2 py-1.5 rounded-md text-muted-foreground text-[10px] flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> Upload
            </div>

            <div className="mt-4 px-2 text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
              Categories
            </div>
            {['Ideation', 'Finance', 'Legal', 'Fundraising'].map((c) => (
              <div key={c} className="px-2 py-1 text-[10px] text-muted-foreground">
                {c}
              </div>
            ))}
          </div>

          {/* Article area */}
          <div className="flex-1 p-5 bg-background">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                Business Model
              </span>
              <span className="text-[9px] text-muted-foreground">· Intermediate</span>
            </div>

            <div className="text-sm font-bold mb-1.5 leading-tight">
              Unit Economics Architecture
            </div>
            <div className="text-[10px] text-muted-foreground mb-4">
              1,720 words · 9 min read
            </div>

            <div className="space-y-2 mb-4">
              <div className="h-2 rounded bg-muted w-full" />
              <div className="h-2 rounded bg-muted w-11/12" />
              <div className="h-2 rounded bg-muted w-9/12" />
            </div>

            {/* Fake table */}
            <div className="rounded-md border overflow-hidden mb-3">
              <div className="grid grid-cols-3 bg-muted/50 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                <div className="px-2 py-1.5 border-r">Metric</div>
                <div className="px-2 py-1.5 border-r">Target</div>
                <div className="px-2 py-1.5">Status</div>
              </div>
              <div className="grid grid-cols-3 text-[10px]">
                <div className="px-2 py-1.5 border-r border-t">LTV/CAC</div>
                <div className="px-2 py-1.5 border-r border-t">&gt; 3.0x</div>
                <div className="px-2 py-1.5 border-t text-emerald-600 font-semibold">4.2x</div>
              </div>
              <div className="grid grid-cols-3 text-[10px]">
                <div className="px-2 py-1.5 border-r border-t">Payback</div>
                <div className="px-2 py-1.5 border-r border-t">&lt; 12 mo</div>
                <div className="px-2 py-1.5 border-t text-emerald-600 font-semibold">9 mo</div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-primary font-semibold">
              Continue reading <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
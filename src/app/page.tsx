'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers,
  ShieldCheck,
  Compass,
  FileCheck2,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navigation */}
      <header className="border-b px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-lg">
            E
          </div>
          <span className="font-bold text-base tracking-tight">LessonHub</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5"
          >
            Go to App <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" /> Curated Knowledge Base for Founders
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl mb-6">
          Venture knowledge, organized for{' '}
          <span className="text-primary underline decoration-primary/30 underline-offset-8">
            fast execution
          </span>
          .
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          Skip generic startup advice. Access systematic frameworks on ideation, customer validation,
          unit economics, pitch architecture, and governance in a distraction-free reader.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
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

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-24 w-full">
          <div className="p-6 rounded-2xl border bg-card/50 space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm">13 Core Categories</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              From zero-to-one validation through institutional Series A term-sheet negotiations.
            </p>
          </div>

          <div className="p-6 rounded-2xl border bg-card/50 space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm">Focused Reader Workspace</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Read comfortably with custom typography, progress tracking, personal notes, and bookmarks.
            </p>
          </div>

          <div className="p-6 rounded-2xl border bg-card/50 space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm">Local Persistence</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All notes, created documents, and reading positions persist locally right in your browser.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © 2026 Entrepreneurship Lesson Hub. Built for founders, mentors, and operators.
      </footer>
    </div>
  );
}
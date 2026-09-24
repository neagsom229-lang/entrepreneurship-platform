'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Clock,
  Type,
  PanelRightClose,
  PanelRightOpen,
  StickyNote,
  Trash2,
  Share2,
  Check,
  Target,
  AlertCircle,
  ChevronRight,
  ListTree,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';

export default function DocumentReaderPage({ params }: { params: { id: string } }) {
  const {
    documents,
    bookmarks,
    toggleBookmark,
    notes,
    addNote,
    deleteNote,
    progress,
    updateProgress,
    fontSize,
    fontFamily,
    setFontSize,
    setFontFamily,
  } = useAppStore();

  const doc = documents.find((d) => d.id === params.id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string>('');

  /* ---------- Scroll progress ---------- */
  useEffect(() => {
    if (!doc) return;
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const pct = Math.min(100, Math.max(0, Math.round((window.scrollY / total) * 100)));
      updateProgress(doc.id, pct);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [doc, updateProgress]);

  /* ---------- Extract H2/H3 headings for TOC ---------- */
  const headings = useMemo(() => {
    if (!doc) return [];
    const regex = /^(#{2,3})\s+(.+)$/gm;
    const result: { level: number; text: string; id: string }[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(doc.content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      result.push({ level, text, id });
    }
    return result;
  }, [doc]);

  /* ---------- Track active section ---------- */
  useEffect(() => {
    if (!doc || headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHeading(entry.target.id);
        });
      },
      { rootMargin: '-100px 0px -70% 0px', threshold: 0 }
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [doc, headings]);

  if (!doc) return notFound();

  const isBookmarked = bookmarks.includes(doc.id);
  const docNotes = notes.filter((n) => n.documentId === doc.id);
  const currentProgress = progress[doc.id]?.percentage || 0;
  const minutesLeft = Math.max(1, Math.ceil(doc.readTime * (1 - currentProgress / 100)));

  /* ---------- Related documents ---------- */
  const related = documents
    .filter((d) => d.id !== doc.id)
    .filter(
      (d) =>
        d.category === doc.category ||
        d.tags.some((t) => doc.tags.includes(t))
    )
    .slice(0, 3);

  const fontClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose',
  } as const;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* no-op */
    }
  };

  return (
    <div className="relative">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <div
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${currentProgress}%` }}
        />
      </div>

      {/* Toolbar */}
      <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-md border-b -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between mb-8">
        <Link
          href="/documents"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Library
        </Link>

        <div className="flex items-center gap-2">
          {/* Reading % label */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-muted-foreground mr-1">
            <span className="font-mono font-semibold text-foreground">{currentProgress}%</span>
            <span>·</span>
            <span>{minutesLeft} min left</span>
          </div>

          {/* Font controls */}
          <div className="flex items-center border rounded-lg p-0.5 bg-card">
            <button
              onClick={() => setFontFamily(fontFamily === 'sans' ? 'serif' : 'sans')}
              className="p-1 rounded text-xs font-semibold px-2 flex items-center gap-1 hover:bg-muted"
              aria-label="Toggle font family"
            >
              <Type className="w-3 h-3" />
              {fontFamily === 'sans' ? 'Sans' : 'Serif'}
            </button>
            <span className="h-3 w-px bg-border mx-1" />
            {(['sm', 'base', 'lg'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                aria-label={`Font size ${size}`}
                className={`px-1.5 py-0.5 text-xs rounded ${
                  fontSize === size
                    ? 'bg-primary text-primary-foreground font-bold'
                    : 'text-muted-foreground'
                }`}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Share */}
          <button
            onClick={handleShare}
            aria-label="Copy link"
            className="p-1.5 border rounded-lg hover:bg-muted text-muted-foreground"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Bookmark */}
          <button
            onClick={() => toggleBookmark(doc.id)}
            aria-label="Bookmark"
            className="p-1.5 border rounded-lg hover:bg-muted text-muted-foreground"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-primary fill-primary" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          {/* Notes toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle notes"
            className="p-1.5 border rounded-lg hover:bg-muted text-muted-foreground relative"
          >
            {isSidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            {docNotes.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[10px] text-primary-foreground font-bold rounded-full flex items-center justify-center">
                {docNotes.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex gap-8 max-w-7xl mx-auto">
        {/* LEFT: TOC */}
        {headings.length > 0 && (
          <aside className="hidden xl:block w-56 shrink-0 sticky top-28 self-start">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
              <ListTree className="w-3 h-3" /> On this page
            </div>
            <ul className="space-y-1.5 border-l-2 border-border pl-3">
              {headings.map((h) => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className={`block text-xs leading-snug transition-colors ${
                      h.level === 3 ? 'pl-3' : ''
                    } ${
                      activeHeading === h.id
                        ? 'text-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* CENTER: Article */}
        <main
          className={`flex-1 max-w-3xl mx-auto ${fontFamily === 'serif' ? 'font-serif' : 'font-sans'}`}
        >
          {/* Header */}
          <div className="border-b pb-6 mb-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10">
                {doc.category}
              </span>
              <span className="text-xs text-muted-foreground">· {doc.difficulty}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{doc.title}</h1>

            {/* Author + meta */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[9px] font-bold text-primary">
                  {doc.author.name.charAt(0)}
                </span>
                <span className="font-semibold text-foreground">{doc.author.name}</span>
                <span>· {doc.author.role}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {doc.readTime} min read
              </span>
              <span>· {doc.wordCount.toLocaleString()} words</span>
              <span>· Updated {new Date(doc.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Prerequisites callout */}
          {doc.prerequisites && (
            <div className="mb-6 p-4 rounded-xl border bg-muted/30 flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                  Prerequisites
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">{doc.prerequisites}</p>
              </div>
            </div>
          )}

          {/* Learning objectives */}
          {doc.learningObjectives.length > 0 && (
            <div className="mb-8 p-5 rounded-xl border-2 border-primary/20 bg-primary/[0.03]">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Learning Objectives
                </span>
              </div>
              <ul className="space-y-2">
                {doc.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-foreground/90">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Markdown content */}
          <article className={`text-foreground/90 ${fontClasses[fontSize]}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: (props) => <h1 className="text-3xl font-bold mt-10 mb-4 tracking-tight" {...props} />,
                h2: ({ children, ...props }) => {
                  const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                  return (
                    <h2 id={id} className="text-2xl font-bold mt-10 mb-4 tracking-tight border-b pb-2 scroll-mt-24" {...props}>
                      {children}
                    </h2>
                  );
                },
                h3: ({ children, ...props }) => {
                  const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                  return (
                    <h3 id={id} className="text-xl font-semibold mt-8 mb-3 scroll-mt-24" {...props}>
                      {children}
                    </h3>
                  );
                },
                p: (props) => <p className="mb-4 leading-relaxed" {...props} />,
                ul: (props) => <ul className="list-disc pl-6 mb-4 space-y-1.5" {...props} />,
                ol: (props) => <ol className="list-decimal pl-6 mb-4 space-y-1.5" {...props} />,
                li: (props) => <li className="leading-relaxed" {...props} />,
                strong: (props) => <strong className="font-bold" {...props} />,
                em: (props) => <em className="italic" {...props} />,
                blockquote: (props) => (
                  <blockquote
                    className="border-l-4 border-primary bg-primary/5 pl-4 py-2 my-5 italic text-foreground/80 rounded-r-lg"
                    {...props}
                  />
                ),
                code: ({
                  inline,
                  className,
                  children,
                  ...props
                }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) =>
                  inline ? (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-[0.9em] font-mono" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className={`${className ?? ''} block`} {...props}>
                      {children}
                    </code>
                  ),
                pre: (props) => (
                  <pre
                    className="bg-muted/60 border rounded-lg p-4 overflow-x-auto my-5 text-xs font-mono leading-relaxed"
                    {...props}
                  />
                ),
                table: (props) => (
                  <div className="overflow-x-auto my-6 rounded-lg border">
                    <table className="w-full text-sm border-collapse" {...props} />
                  </div>
                ),
                thead: (props) => <thead className="bg-muted/60" {...props} />,
                th: (props) => (
                  <th className="border-b px-3 py-2.5 text-left font-bold text-xs uppercase tracking-wider" {...props} />
                ),
                td: (props) => <td className="border-b px-3 py-2.5 align-top" {...props} />,
                a: (props) => <a className="text-primary underline hover:no-underline font-medium" {...props} />,
                hr: (props) => <hr className="my-8 border-border" {...props} />,
                input: (props) => <input className="mr-2 accent-primary" {...props} />,
              }}
            >
              {doc.content}
            </ReactMarkdown>
          </article>

          {/* Related documents */}
          {related.length > 0 && (
            <div className="mt-16 pt-8 border-t">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Continue learning
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/documents/${r.id}`}
                    className="group border rounded-xl p-4 bg-card hover:border-primary/40 hover:bg-primary/[0.02] transition-all"
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        {r.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{r.readTime}m</span>
                    </div>
                    <div className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {r.title}
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-primary font-semibold">
                      Read next <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* RIGHT: Notes drawer */}
        {isSidebarOpen && (
          <aside className="w-80 shrink-0 border rounded-xl p-4 bg-card h-fit sticky top-28 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <StickyNote className="w-3.5 h-3.5 text-primary" /> Document Notes
              </h3>
              <span className="text-[11px] text-muted-foreground font-mono">{docNotes.length}</span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {docNotes.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-2">
                  No notes added for this lesson yet.
                </p>
              ) : (
                docNotes.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-lg border bg-muted/30 text-xs space-y-1 relative group"
                  >
                    <p className="text-foreground whitespace-pre-wrap">{n.content}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        onClick={() => deleteNote(n.id)}
                        aria-label="Delete note"
                        className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2 pt-2 border-t">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Jot down key takeaways..."
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border bg-background focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
              <button
                onClick={() => {
                  if (!noteContent.trim()) return;
                  addNote(doc.id, noteContent);
                  setNoteContent('');
                }}
                className="w-full py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save Note
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
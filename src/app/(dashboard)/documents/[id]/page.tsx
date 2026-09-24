'use client';

import React, { useEffect, useState } from 'react';
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

  // Scroll Progress Calculation
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

  if (!doc) {
    return notFound();
  }

  const isBookmarked = bookmarks.includes(doc.id);
  const docNotes = notes.filter((n) => n.documentId === doc.id);
  const currentProgress = progress[doc.id]?.percentage || 0;

  const fontClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose',
  };

  return (
    <div className="relative">
      {/* Top Floating Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <div
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${currentProgress}%` }}
        />
      </div>

      {/* Reader Controls Toolbar */}
      <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-md border-b -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between mb-8">
        <Link
          href="/documents"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Library
        </Link>

        <div className="flex items-center gap-2">
          {/* Font Controls */}
          <div className="flex items-center border rounded-lg p-0.5 bg-card">
            <button
              onClick={() => setFontFamily(fontFamily === 'sans' ? 'serif' : 'sans')}
              className="p-1 rounded text-xs font-semibold px-2 flex items-center gap-1 hover:bg-muted"
            >
              <Type className="w-3 h-3" />
              {fontFamily === 'sans' ? 'Sans' : 'Serif'}
            </button>
            <span className="h-3 w-px bg-border mx-1" />
            {(['sm', 'base', 'lg'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-1.5 py-0.5 text-xs rounded ${
                  fontSize === size ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground'
                }`}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Bookmark Toggle */}
          <button
            onClick={() => toggleBookmark(doc.id)}
            className="p-1.5 border rounded-lg hover:bg-muted text-muted-foreground"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-primary fill-primary" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          {/* Sidebar Notes Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
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

      {/* Reader Body */}
      <div className="flex gap-8 max-w-6xl mx-auto">
        <main
          className={`flex-1 max-w-3xl mx-auto transition-all ${
            fontFamily === 'serif' ? 'font-serif' : 'font-sans'
          }`}
        >
          {/* Header Metadata */}
          <div className="border-b pb-6 mb-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10">
                {doc.category}
              </span>
              <span className="text-xs text-muted-foreground">• {doc.difficulty}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {doc.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {doc.readTime} min read
              </span>
              <span>•</span>
              <span>Updated {new Date(doc.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Article Prose Content */}
          <article className={`space-y-6 text-foreground/90 leading-relaxed ${fontClasses[fontSize]}`}>
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    h1: (props) => <h1 className="text-3xl font-bold mt-10 mb-4 tracking-tight" {...props} />,
    h2: (props) => <h2 className="text-2xl font-bold mt-10 mb-4 tracking-tight border-b pb-2" {...props} />,
    h3: (props) => <h3 className="text-xl font-semibold mt-8 mb-3" {...props} />,
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
    code: ({ inline, className, children, ...props }: any) =>
      inline ? (
        <code className="bg-muted px-1.5 py-0.5 rounded text-[0.9em] font-mono text-foreground" {...props}>
          {children}
        </code>
      ) : (
        <code className={`${className ?? ''} block`} {...props}>{children}</code>
      ),
    pre: (props) => (
      <pre className="bg-muted/60 border rounded-lg p-4 overflow-x-auto my-5 text-xs font-mono leading-relaxed" {...props} />
    ),
    table: (props) => (
      <div className="overflow-x-auto my-6 rounded-lg border">
        <table className="w-full text-sm border-collapse" {...props} />
      </div>
    ),
    thead: (props) => <thead className="bg-muted/60" {...props} />,
    th: (props) => <th className="border-b px-3 py-2.5 text-left font-bold text-xs uppercase tracking-wider" {...props} />,
    td: (props) => <td className="border-b px-3 py-2.5 align-top" {...props} />,
    a: (props) => <a className="text-primary underline hover:no-underline font-medium" {...props} />,
    hr: (props) => <hr className="my-8 border-border" {...props} />,
    input: (props) => <input className="mr-2 accent-primary" {...props} />,
  }}
>
  {doc.content}
</ReactMarkdown>
          </article>
        </main>
        

        {/* Sidebar Notes Drawer */}
        {isSidebarOpen && (
          <aside className="w-80 shrink-0 border rounded-xl p-4 bg-card h-fit sticky top-28 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <StickyNote className="w-3.5 h-3.5 text-primary" /> Document Notes
              </h3>
              <span className="text-[11px] text-muted-foreground font-mono">{docNotes.length}</span>
            </div>

            {/* Existing Notes */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {docNotes.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-2">No notes added for this lesson yet.</p>
              ) : (
                docNotes.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-lg border bg-muted/30 text-xs space-y-1 relative group">
                    <p className="text-foreground whitespace-pre-wrap">{n.content}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        onClick={() => deleteNote(n.id)}
                        className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Note Input */}
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
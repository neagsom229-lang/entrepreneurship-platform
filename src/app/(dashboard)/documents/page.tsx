'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Grid,
  List,
  Clock,
  Bookmark,
  BookmarkCheck,
  X,
  ArrowDownUp,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { Category, Difficulty } from '@/types';

const CATEGORIES: Category[] = [
  'Ideation', 'Market Research', 'Business Model', 'Marketing', 'Sales',
  'Finance', 'Legal', 'Fundraising', 'Team', 'Operations', 'Growth',
  'Pitch Deck', 'Templates',
];

type SortKey = 'newest' | 'oldest' | 'readTime' | 'alpha' | 'difficulty';

export default function DocumentLibraryPage() {
  const { documents, bookmarks, toggleBookmark, progress } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  /* ---------- All unique tags ---------- */
  const allTags = useMemo(() => {
    const set = new Set<string>();
    documents.forEach((d) => d.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [documents]);

  /* ---------- Filter + sort pipeline ---------- */
  const filteredDocuments = useMemo(() => {
    const list = documents.filter((doc) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.summary.toLowerCase().includes(q) ||
        doc.tags.some((t) => t.toLowerCase().includes(q));

      const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || doc.difficulty === selectedDifficulty;
      const matchesTags =
        selectedTags.length === 0 || selectedTags.every((t) => doc.tags.includes(t));

      return matchesSearch && matchesCategory && matchesDifficulty && matchesTags;
    });

    const sorted = [...list];
    switch (sortKey) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'readTime':
        sorted.sort((a, b) => b.readTime - a.readTime);
        break;
      case 'alpha':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'difficulty': {
        const order = { Beginner: 0, Intermediate: 1, Advanced: 2 };
        sorted.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
        break;
      }
    }
    return sorted;
  }, [documents, searchQuery, selectedCategory, selectedDifficulty, selectedTags, sortKey]);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedTags.length > 0;

  const clearAll = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Document Library</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Browse, search, and filter entrepreneurship frameworks and strategy templates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg p-0.5 bg-card">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3 bg-card p-4 rounded-xl border">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, concept, or tag..."
              className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Difficulty */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="text-xs border rounded-lg px-2.5 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-36"
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* Sort */}
          <div className="relative w-full md:w-44">
            <ArrowDownUp className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="text-xs border rounded-lg pl-8 pr-2.5 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-primary w-full appearance-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="readTime">Read time</option>
              <option value="alpha">Alphabetical</option>
              <option value="difficulty">Difficulty</option>
            </select>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-2.5 py-1 rounded-full shrink-0 font-medium transition-colors ${
              selectedCategory === 'All'
                ? 'bg-primary text-primary-foreground'
                : 'border bg-background text-muted-foreground hover:bg-muted'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full shrink-0 font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'border bg-background text-muted-foreground hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
              Tags:
            </span>
            {allTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'border bg-background text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}

        {/* Result count + clear */}
        <div className="flex items-center justify-between pt-1 border-t">
          <span className="text-[11px] text-muted-foreground font-medium">
            {filteredDocuments.length} of {documents.length} documents
            {selectedTags.length > 0 && ` · ${selectedTags.length} tag filter${selectedTags.length > 1 ? 's' : ''} active`}
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {filteredDocuments.length === 0 ? (
        <div className="py-16 text-center border rounded-xl bg-card">
          <p className="text-sm font-semibold">No frameworks matched your filter</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Try adjusting your search criteria or clear category filters.
          </p>
          <button
            onClick={clearAll}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocuments.map((doc) => {
            const isBookmarked = bookmarks.includes(doc.id);
            const prog = progress[doc.id]?.percentage || 0;
            const completed = prog >= 90;
            const inProgress = prog > 0 && prog < 90;

            return (
              <div
                key={doc.id}
                className="border rounded-xl bg-card p-5 flex flex-col justify-between hover:border-primary/50 hover:shadow-sm transition-all relative group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-primary uppercase text-[10px] tracking-wider px-2 py-0.5 rounded-full bg-primary/10">
                        {doc.category}
                      </span>
                      {completed && (
                        <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      )}
                      {inProgress && (
                        <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                          <Loader2 className="w-3 h-3" /> {prog}%
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => toggleBookmark(doc.id)}
                      aria-label="Bookmark"
                      className="p-1 rounded hover:bg-muted text-muted-foreground"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-primary fill-primary" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <Link href={`/documents/${doc.id}`} className="block">
                    <h3 className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {doc.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
                    {doc.summary}
                  </p>

                  {/* Progress bar */}
                  {prog > 0 && (
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-primary" style={{ width: `${prog}%` }} />
                    </div>
                  )}
                </div>

                <div className="border-t pt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {doc.readTime}m
                  </span>
                  <span className="truncate max-w-[100px]">{doc.author.name}</span>
                  <span className="font-medium text-foreground">{doc.difficulty}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border rounded-xl bg-card divide-y">
          {filteredDocuments.map((doc) => {
            const isBookmarked = bookmarks.includes(doc.id);
            const prog = progress[doc.id]?.percentage || 0;

            return (
              <div
                key={doc.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10">
                      {doc.category}
                    </span>
                    <span className="text-xs text-muted-foreground">· {doc.difficulty}</span>
                    {prog > 0 && (
                      <span className="text-[10px] font-mono text-muted-foreground">
                        · {prog}%
                      </span>
                    )}
                  </div>
                  <Link href={`/documents/${doc.id}`}>
                    <h3 className="font-bold text-sm hover:text-primary transition-colors truncate">
                      {doc.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-1">{doc.summary}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {doc.readTime} min
                  </span>
                  <button
                    onClick={() => toggleBookmark(doc.id)}
                    aria-label="Bookmark"
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-primary fill-primary" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                  <Link
                    href={`/documents/${doc.id}`}
                    className="px-3 py-1.5 rounded-lg border text-foreground font-semibold hover:bg-muted transition-colors text-xs"
                  >
                    Read
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
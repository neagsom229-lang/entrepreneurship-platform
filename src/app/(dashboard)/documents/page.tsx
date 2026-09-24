'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Grid,
  List,
  Clock,
  Tag,
  Bookmark,
  BookmarkCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { Category, Difficulty } from '@/types';

const CATEGORIES: Category[] = [
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

export default function DocumentLibraryPage() {
  const { documents, bookmarks, toggleBookmark } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter Pipeline
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || doc.category === selectedCategory;

      const matchesDifficulty =
        selectedDifficulty === 'All' || doc.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [documents, searchQuery, selectedCategory, selectedDifficulty]);

  return (
    <div className="space-y-6">
      {/* Title & Layout Controls */}
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
              className={`p-1.5 rounded ${
                viewMode === 'grid' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${
                viewMode === 'list' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 bg-card p-4 rounded-xl border">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by keyword, concept, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
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
          </div>
        </div>

        {/* Category Pills */}
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
      </div>

      {/* Grid or List Render */}
      {filteredDocuments.length === 0 ? (
        <div className="py-16 text-center border rounded-xl bg-card">
          <p className="text-sm font-semibold">No frameworks matched your filter</p>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search criteria or clear category filters.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocuments.map((doc) => {
            const isBookmarked = bookmarks.includes(doc.id);
            return (
              <div
                key={doc.id}
                className="border rounded-xl bg-card p-5 flex flex-col justify-between hover:border-primary/50 transition-colors shadow-sm relative group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="font-semibold text-primary uppercase text-[10px] tracking-wider px-2 py-0.5 rounded-full bg-primary/10">
                      {doc.category}
                    </span>
                    <button
                      onClick={() => toggleBookmark(doc.id)}
                      className="p-1 rounded hover:bg-muted text-muted-foreground"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-primary fill-primary" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <Link href={`/documents/${doc.id}`} className="block group">
                    <h3 className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {doc.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                    {doc.summary}
                  </p>
                </div>

                <div className="border-t pt-3 flex items-center justify-between text-[11px] text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {doc.readTime}m read
                  </span>
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
            return (
              <div
                key={doc.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10">
                      {doc.category}
                    </span>
                    <span className="text-xs text-muted-foreground">• {doc.difficulty}</span>
                  </div>
                  <Link href={`/documents/${doc.id}`}>
                    <h3 className="font-bold text-sm hover:text-primary transition-colors">
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
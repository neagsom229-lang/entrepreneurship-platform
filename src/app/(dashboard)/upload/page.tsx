'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUp, Eye, Edit3, CheckCircle2 } from 'lucide-react';
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

export default function UploadPage() {
  const router = useRouter();
  const { addDocument } = useAppStore();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState<Category>('Ideation');
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');
  const [readTime, setReadTime] = useState(5);
  const [tagsInput, setTagsInput] = useState('Framework, Operations');
  const [content, setContent] = useState(`## Overview
Briefly define the context of this entrepreneurship framework.

### Strategic Application
- Step 1: Discover friction
- Step 2: Formulate qualitative experiments
`);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addDocument({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      summary,
      content,
      category,
      difficulty,
      readTime: Number(readTime) || 5,
      tags,
    });

    router.push('/documents');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Upload & Author Document</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Draft structured Markdown frameworks or drop in lessons. Stored locally for Phase 1.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold">Document Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. B2B Churn Diagnostic Matrix"
              className="w-full text-xs p-2.5 rounded-lg border bg-card focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full text-xs p-2.5 rounded-lg border bg-card focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold">Summary / Abstract</label>
          <input
            type="text"
            required
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="One-to-two sentence strategic takeaway..."
            className="w-full text-xs p-2.5 rounded-lg border bg-card focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full text-xs p-2.5 rounded-lg border bg-card focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold">Read Time (minutes)</label>
            <input
              type="number"
              min={1}
              value={readTime}
              onChange={(e) => setReadTime(Number(e.target.value))}
              className="w-full text-xs p-2.5 rounded-lg border bg-card focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold">Tags (comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border bg-card focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Markdown Authoring / Live Preview Area */}
        <div className="border rounded-xl bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-2 bg-muted/40">
            <span className="text-xs font-semibold">Content Editor</span>
            <div className="flex items-center gap-1 border rounded-lg p-0.5 bg-background">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded font-medium ${
                  activeTab === 'write' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Write
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded font-medium ${
                  activeTab === 'preview' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
            </div>
          </div>

          {activeTab === 'write' ? (
            <textarea
              rows={14}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Draft your framework using Markdown..."
              className="w-full text-xs p-4 bg-background focus:outline-none font-mono resize-y"
            />
          ) : (
            <div className="p-4 prose prose-sm dark:prose-invert max-w-none min-h-[300px] whitespace-pre-wrap text-xs">
              {content || <span className="text-muted-foreground italic">Nothing to preview.</span>}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" /> Save Framework to Library
        </button>
      </form>
    </div>
  );
}
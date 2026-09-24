import { z } from 'zod';

export const CategoryEnum = z.enum([
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
]);

export const DifficultyEnum = z.enum(['Beginner', 'Intermediate', 'Advanced']);

export const AuthorSchema = z.object({
  name: z.string().min(1, 'Author name is required'),
  role: z.string().min(1, 'Author role is required'),
  avatar: z.string().url().optional().or(z.literal('')),
});

export const DocumentItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(2),
  category: CategoryEnum,
  difficulty: DifficultyEnum,
  readTime: z.number().int().positive(),
  wordCount: z.number().int().nonnegative(),
  tags: z.array(z.string()).default([]),
  author: AuthorSchema,
  updatedAt: z.string(),
  createdAt: z.string().optional(),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  prerequisites: z.string().default('None'),
  learningObjectives: z.array(z.string()).min(1, 'At least one objective is required'),
  content: z.string().min(50, 'Document content is too short'),
});

export const NoteSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  content: z.string().min(1, 'Note content cannot be empty'),
  createdAt: z.string(),
});

export const ReadingProgressRecordSchema = z.object({
  documentId: z.string(),
  percentage: z.number().min(0).max(100),
  lastReadAt: z.string(),
});

export type DocumentItemInput = z.infer<typeof DocumentItemSchema>;
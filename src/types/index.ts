export type Category =
  | 'Ideation'
  | 'Market Research'
  | 'Business Model'
  | 'Marketing'
  | 'Sales'
  | 'Finance'
  | 'Legal'
  | 'Fundraising'
  | 'Team'
  | 'Operations'
  | 'Growth'
  | 'Pitch Deck'
  | 'Templates';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Author {
  name: string;
  role: string;
  avatar?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: Category;
  tags: string[];
  difficulty: Difficulty;
  readTime: number;      // Math.ceil(wordCount / 200)
  wordCount: number;
  author: Author;
  prerequisites: string;
  learningObjectives: string[];
  createdAt: string;     // ← THE FIX
  updatedAt: string;
}

export interface Note {
  id: string;
  documentId: string;
  content: string;
  createdAt: string;
}

export interface ReadingProgressRecord {
  documentId: string;
  percentage: number;
  lastReadAt: string;
}
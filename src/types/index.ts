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

export interface LearningObjective {
  id: string;
  objective: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  slug: string;
  category: Category;
  difficulty: Difficulty;
  readTime: number; // Computed at ~200 WPM
  wordCount: number;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  updatedAt: string;
  summary: string;
  prerequisites: string;
  learningObjectives: string[];
  content: string; // Structured Markdown
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
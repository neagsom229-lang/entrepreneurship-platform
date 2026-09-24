import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DocumentItem, Note, ReadingProgressRecord, Category, Difficulty } from '@/types';
import { INITIAL_DOCUMENTS } from '@/lib/mock-data';

interface AppState {
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Documents
  documents: DocumentItem[];
  addDocument: (doc: Omit<DocumentItem, 'id' | 'createdAt' | 'updatedAt'>) => void;

  // Bookmarks & Notes
  bookmarks: string[]; // document IDs
  toggleBookmark: (docId: string) => void;
  notes: Note[];
  addNote: (documentId: string, content: string) => void;
  deleteNote: (noteId: string) => void;

  // Reading Progress
  progress: Record<string, ReadingProgressRecord>;
  updateProgress: (docId: string, percentage: number) => void;

  // Reader Settings
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  fontFamily: 'sans' | 'serif';
  setFontSize: (size: 'sm' | 'base' | 'lg' | 'xl') => void;
  setFontFamily: (family: 'sans' | 'serif') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      toggleTheme: () => {
        const next = !get().isDarkMode;
        set({ isDarkMode: next });
        if (typeof document !== 'undefined') {
          if (next) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },

      documents: INITIAL_DOCUMENTS,
      addDocument: (newDoc) => {
        const doc: DocumentItem = {
          ...newDoc,
          id: `doc-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ documents: [doc, ...state.documents] }));
      },

      bookmarks: [],
      toggleBookmark: (docId) => {
        set((state) => {
          const exists = state.bookmarks.includes(docId);
          return {
            bookmarks: exists
              ? state.bookmarks.filter((id) => id !== docId)
              : [...state.bookmarks, docId],
          };
        });
      },

      notes: [],
      addNote: (documentId, content) => {
        const note: Note = {
          id: `note-${Date.now()}`,
          documentId,
          content,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ notes: [note, ...state.notes] }));
      },
      deleteNote: (noteId) => {
        set((state) => ({ notes: state.notes.filter((n) => n.id !== noteId) }));
      },

      progress: {},
      updateProgress: (documentId, percentage) => {
        set((state) => ({
          progress: {
            ...state.progress,
            [documentId]: {
              documentId,
              percentage,
              lastReadAt: new Date().toISOString(),
            },
          },
        }));
      },

      fontSize: 'base',
      fontFamily: 'sans',
      setFontSize: (fontSize) => set({ fontSize }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
    }),
    {
      name: 'entrepreneurship-hub-storage',
    }
  )
);
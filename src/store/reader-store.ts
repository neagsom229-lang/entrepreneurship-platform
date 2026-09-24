import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, ReadingProgressRecord } from '@/types';
import { migrateLegacyStorage } from './migrate-legacy-store';

export type LineHeightOption = 'compact' | 'comfortable' | 'spacious';

interface ReaderState {
  // Reading preferences
  fontSize: number; // in pixels (14 - 22)
  fontFamily: 'sans' | 'serif';
  lineHeight: LineHeightOption;

  // Bookmarks & Notes
  bookmarks: string[]; // document IDs
  notes: Note[];

  // Reading Progress: documentId -> ReadingProgressRecord
  progress: Record<string, ReadingProgressRecord>;

  // Interactive Checklist State: documentId -> (checklistIndex -> boolean)
  checklistState: Record<string, Record<number, boolean>>;

  // Actions
  setFontSize: (size: number) => void;
  setFontFamily: (family: 'sans' | 'serif') => void;
  setLineHeight: (lineHeight: LineHeightOption) => void;
  toggleBookmark: (docId: string) => void;
  isBookmarked: (docId: string) => boolean;
  addNote: (documentId: string, content: string) => void;
  deleteNote: (noteId: string) => void;
  updateProgress: (documentId: string, percentage: number) => void;
  toggleChecklistItem: (documentId: string, itemIndex: number) => void;
  resetChecklist: (documentId: string) => void;
  getChecklistCompletion: (documentId: string, totalItems: number) => number;
}

if (typeof window !== 'undefined') {
  migrateLegacyStorage();
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set, get) => ({
      fontSize: 16,
      fontFamily: 'sans',
      lineHeight: 'comfortable',
      bookmarks: [],
      notes: [],
      progress: {},
      checklistState: {},

      setFontSize: (fontSize) => set({ fontSize }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setLineHeight: (lineHeight) => set({ lineHeight }),

      toggleBookmark: (docId) =>
        set((state) => {
          const exists = state.bookmarks.includes(docId);
          return {
            bookmarks: exists
              ? state.bookmarks.filter((id) => id !== docId)
              : [...state.bookmarks, docId],
          };
        }),

      isBookmarked: (docId) => get().bookmarks.includes(docId),

      addNote: (documentId, content) => {
        const newNote: Note = {
          id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          documentId,
          content,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ notes: [newNote, ...state.notes] }));
      },

      deleteNote: (noteId) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== noteId),
        })),

      updateProgress: (documentId, percentage) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [documentId]: {
              documentId,
              percentage,
              lastReadAt: new Date().toISOString(),
            },
          },
        })),

      toggleChecklistItem: (documentId, itemIndex) =>
        set((state) => {
          const currentDocState = state.checklistState[documentId] || {};
          const currentVal = !!currentDocState[itemIndex];
          return {
            checklistState: {
              ...state.checklistState,
              [documentId]: {
                ...currentDocState,
                [itemIndex]: !currentVal,
              },
            },
          };
        }),

      resetChecklist: (documentId) =>
        set((state) => {
          const next = { ...state.checklistState };
          delete next[documentId];
          return { checklistState: next };
        }),

      getChecklistCompletion: (documentId, totalItems) => {
        if (!totalItems || totalItems === 0) return 0;
        const currentDocState = get().checklistState[documentId] || {};
        const checkedCount = Object.values(currentDocState).filter(Boolean).length;
        return Math.min(100, Math.round((checkedCount / totalItems) * 100));
      },
    }),
    {
      name: 'hub-reader-store',
    }
  )
);
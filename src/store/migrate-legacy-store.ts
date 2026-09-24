/**
 * Checks for the old single-store key 'entrepreneurship-hub-storage'
 * and populates the new sliced stores if they haven't been seeded yet.
 */
export function migrateLegacyStorage() {
  if (typeof window === 'undefined') return;

  const legacyRaw = localStorage.getItem('entrepreneurship-hub-storage');
  if (!legacyRaw) return;

  try {
    const parsed = JSON.parse(legacyRaw);
    const state = parsed?.state;
    if (!state) return;

    // Check if new stores already have data
    const hasNewDocStore = localStorage.getItem('hub-document-store');
    const hasNewReaderStore = localStorage.getItem('hub-reader-store');
    const hasNewUIStore = localStorage.getItem('hub-ui-store');

    if (!hasNewDocStore && state.documents) {
      localStorage.setItem(
        'hub-document-store',
        JSON.stringify({
          state: {
            customDocuments: state.documents.filter((d: { id: string }) => !d.id.startsWith('doc-')),
          },
          version: 1,
        })
      );
    }

    if (!hasNewReaderStore) {
      localStorage.setItem(
        'hub-reader-store',
        JSON.stringify({
          state: {
            bookmarks: state.bookmarks || [],
            notes: state.notes || [],
            progress: state.progress || {},
            fontSize: state.fontSize === 'sm' ? 14 : state.fontSize === 'lg' ? 18 : state.fontSize === 'xl' ? 20 : 16,
            fontFamily: state.fontFamily || 'sans',
            lineHeight: 'comfortable',
            checklistState: {},
          },
          version: 1,
        })
      );
    }

    if (!hasNewUIStore) {
      localStorage.setItem(
        'hub-ui-store',
        JSON.stringify({
          state: {
            isDarkMode: !!state.isDarkMode,
          },
          version: 1,
        })
      );
    }
  } catch (error) {
    console.error('Failed to migrate legacy localStorage store:', error);
  }
}
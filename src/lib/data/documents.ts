import { DocumentItem, Category } from '@/types';
import { INITIAL_DOCUMENTS } from '@/lib/mock-data';
import { DocumentItemSchema } from '@/lib/schemas';

/**
 * Data Access Layer (DAL)
 * Provides typed asynchronous calls that simulate database queries.
 * In Phase 2, these can be substituted with direct Supabase / Postgres queries
 * without modifying UI or component consumer contracts.
 */

// In-memory registry combining core curriculum documents
let documentCache: DocumentItem[] = [...INITIAL_DOCUMENTS];

/**
 * Validates and caches documents internally
 */
function validateAndGetCatalog(): DocumentItem[] {
  return documentCache.map((doc) => {
    const parsed = DocumentItemSchema.safeParse(doc);
    if (!parsed.success) {
      console.warn(`Document schema warning for id ${doc.id}:`, parsed.error.format());
      return doc;
    }
    return parsed.data as DocumentItem;
  });
}

/**
 * Retrieves all published curriculum documents.
 */
export async function getDocuments(): Promise<DocumentItem[]> {
  // Simulates microtask async boundary for future DB adapters
  await Promise.resolve();
  return validateAndGetCatalog();
}

/**
 * Finds a document by its unique id.
 */
export async function getDocumentById(id: string): Promise<DocumentItem | null> {
  await Promise.resolve();
  const docs = validateAndGetCatalog();
  const found = docs.find((d) => d.id === id);
  return found || null;
}

/**
 * Finds a document by its URL slug.
 */
export async function getDocumentBySlug(slug: string): Promise<DocumentItem | null> {
  await Promise.resolve();
  const docs = validateAndGetCatalog();
  const found = docs.find((d) => d.slug === slug);
  return found || null;
}

/**
 * Retrieves up to 3 related documents based on identical category or shared tags.
 */
export async function getRelatedDocuments(
  currentId: string,
  limit: number = 3
): Promise<DocumentItem[]> {
  await Promise.resolve();
  const docs = validateAndGetCatalog();
  const current = docs.find((d) => d.id === currentId);

  if (!current) {
    return docs.filter((d) => d.id !== currentId).slice(0, limit);
  }

  const otherDocs = docs.filter((d) => d.id !== currentId);

  // Score relationship by category (+3 points) and each matching tag (+1 point)
  const scored = otherDocs.map((doc) => {
    let score = 0;
    if (doc.category === current.category) score += 3;
    const commonTags = doc.tags.filter((t) => current.tags.includes(t));
    score += commonTags.length;
    return { doc, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.doc);
}

/**
 * Retrieves total document count grouped by Category.
 */
export async function getCategoryCounts(): Promise<Record<Category, number>> {
  await Promise.resolve();
  const docs = validateAndGetCatalog();
  const counts = {} as Record<Category, number>;

  for (const doc of docs) {
    counts[doc.category] = (counts[doc.category] || 0) + 1;
  }

  return counts;
}

/**
 * Appends a user-created document to the in-memory store.
 */
export async function insertCustomDocument(doc: DocumentItem): Promise<DocumentItem> {
  const validated = DocumentItemSchema.parse(doc);
  documentCache = [validated as DocumentItem, ...documentCache];
  return validated as DocumentItem;
}
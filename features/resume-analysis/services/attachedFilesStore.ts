/**
 * Module-level in-memory store for `File` objects attached to positions.
 *
 * `File` objects cannot be serialised to localStorage, so we keep them here
 * for the duration of the browser session.  The persistent metadata (filename,
 * candidate ID, timestamp) lives in localStorage via `usePositions`.
 */

/** Map<positionId, File[]> */
const store = new Map<string, File[]>();

/** Return all files attached to a position (or an empty array). */
export function getAttachedFiles(positionId: string): File[] {
  return store.get(positionId) ?? [];
}

/** Append a file to a position's in-memory list. */
export function addAttachedFile(positionId: string, file: File): void {
  const existing = store.get(positionId) ?? [];
  store.set(positionId, [...existing, file]);
}

/** Remove a specific file (matched by name) from a position's in-memory list. */
export function removeAttachedFile(positionId: string, filename: string): void {
  const existing = store.get(positionId) ?? [];
  store.set(
    positionId,
    existing.filter((f) => f.name !== filename)
  );
}

/** Remove all files for a position (e.g. when the position is deleted). */
export function clearAttachedFiles(positionId: string): void {
  store.delete(positionId);
}

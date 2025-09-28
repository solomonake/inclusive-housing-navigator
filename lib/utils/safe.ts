/**
 * Safe utility functions for defensive programming
 */

/**
 * Ensures a value is an array, returning fallback if not
 */
export function ensureArray<T>(value: unknown, fallback: T[] = []): T[] {
  return Array.isArray(value) ? value : fallback;
}

/**
 * Safely converts a value to number with fallback
 */
export function toNumber(v: unknown, d = 0): number {
  if (typeof v === 'number' && !isNaN(v)) return v;
  if (typeof v === 'string') {
    const parsed = parseFloat(v);
    return isNaN(parsed) ? d : parsed;
  }
  return d;
}

/**
 * Type guard to check if array exists and has items
 */
export function nonEmpty<T>(arr?: T[]): arr is T[] {
  return !!arr && arr.length > 0;
}

/**
 * Safely gets nested property with fallback
 */
export function safeGet<T>(obj: unknown, path: string, fallback: T): T {
  try {
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as any)[key];
      } else {
        return fallback;
      }
    }
    return current as T;
  } catch {
    return fallback;
  }
}

/**
 * Safely parses JSON with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

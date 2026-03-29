/**
 * storage.js — localStorage utility for persisting tasks.
 *
 * Provides load/save helpers with JSON serialization and
 * error handling so the app degrades gracefully if storage
 * is unavailable (e.g. private browsing quota exceeded).
 */

const STORAGE_KEY = 'gmc_todo_tasks'

/**
 * Load tasks from localStorage.
 * Returns the parsed array or the provided fallback if
 * nothing is stored or the data is corrupt.
 */
export function loadTasks(fallback = []) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

/**
 * Save the tasks array to localStorage.
 * Silently catches quota/serialization errors.
 */
export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // Storage full or unavailable — fail silently
  }
}

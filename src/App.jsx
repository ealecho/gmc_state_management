import { useState, useEffect, useCallback } from 'react'
import { loadTasks, saveTasks } from './utils/storage'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import Filter from './components/Filter'

/**
 * PRIORITY_ORDER — Numeric weight for sorting tasks by priority.
 * Lower number = higher priority = appears first.
 */
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

/**
 * SEED_TASKS — Default tasks shown on first visit (empty localStorage).
 * Gives the user something to interact with immediately.
 */
const SEED_TASKS = [
  {
    id: 1,
    name: 'Set up project architecture',
    description: 'Initialize the React app with Vite, Tailwind CSS, and component structure.',
    priority: 'high',
    dueDate: null,
    completed: true,
    createdAt: Date.now() - 3600000,
  },
  {
    id: 2,
    name: 'Implement localStorage persistence',
    description: 'Save tasks to localStorage on every change and load them on app init.',
    priority: 'high',
    dueDate: null,
    completed: false,
    createdAt: Date.now() - 1800000,
  },
  {
    id: 3,
    name: 'Add filtering and sorting',
    description: 'Filter tasks by completion status. Sort by priority, date created, or due date.',
    priority: 'medium',
    dueDate: null,
    completed: false,
    createdAt: Date.now() - 900000,
  },
  {
    id: 4,
    name: 'Write README documentation',
    description: 'Explain how to run the app locally and describe the component architecture.',
    priority: 'low',
    dueDate: null,
    completed: false,
    createdAt: Date.now(),
  },
]

/**
 * App — Root component and single source of truth for task state.
 *
 * State management strategy:
 *  - `tasks` is the master array, lifted to App level.
 *  - Every mutation (add, edit, delete, toggle) produces a new array.
 *  - A useEffect syncs the array to localStorage on every change.
 *  - On mount, tasks are loaded from localStorage (or seeded with defaults).
 *  - Filtering and sorting derive a new array without mutating state.
 */
function App() {
  // ── Core State ──────────────────────────────────────────
  const [tasks, setTasks] = useState(() => loadTasks(SEED_TASKS))
  const [showForm, setShowForm] = useState(false)

  // ── Filter & Sort State ─────────────────────────────────
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // ── Persist to localStorage whenever tasks change ───────
  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  // ── Task Mutations ──────────────────────────────────────

  /** Add a new task to the beginning of the list. */
  const addTask = useCallback((data) => {
    const newTask = {
      id: Date.now(),
      ...data,
      completed: false,
      createdAt: Date.now(),
    }
    setTasks((prev) => [newTask, ...prev])
    setShowForm(false)
  }, [])

  /** Toggle the completed status of a task. */
  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }, [])

  /** Edit an existing task's data (name, description, priority, dueDate). */
  const editTask = useCallback((id, data) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    )
  }, [])

  /** Delete a task by id. */
  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // ── Derived: Filtered & Sorted ──────────────────────────

  const filteredAndSorted = (() => {
    // 1. Filter by status
    let result = tasks
    if (statusFilter === 'active') {
      result = result.filter((t) => !t.completed)
    } else if (statusFilter === 'completed') {
      result = result.filter((t) => t.completed)
    }

    // 2. Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return a.createdAt - b.createdAt
        case 'priority':
          return (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1)
        case 'dueDate': {
          // Tasks without due dates go to the end
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return a.dueDate.localeCompare(b.dueDate)
        }
        default: // newest
          return b.createdAt - a.createdAt
      }
    })

    return result
  })()

  // ── Counts for the header ───────────────────────────────
  const activeCount = tasks.filter((t) => !t.completed).length
  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <main className="flex flex-col gap-8 pt-12 max-sm:pt-8">
      {/* ── Header ────────────────────────────────────── */}
      <header className="flex flex-col gap-1">
        <h1 className="heading-gradient text-4xl font-bold tracking-tight max-sm:text-2xl">
          To-Do List
        </h1>
        <p className="text-sm text-text-muted">
          {activeCount} active &middot; {completedCount} completed &middot;{' '}
          {tasks.length} total
        </p>
      </header>

      {/* ── Toolbar ───────────────────────────────────── */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1">
            <Filter
              statusFilter={statusFilter}
              sortBy={sortBy}
              onStatusChange={setStatusFilter}
              onSortChange={setSortBy}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="cursor-pointer self-end rounded-lg border border-accent-border bg-accent-bg px-5 py-2.5 text-sm font-medium text-accent touch-manipulation transition-[background-color,box-shadow,border-color] duration-200 hover:bg-[rgba(0,212,170,0.12)] hover:border-[rgba(0,212,170,0.4)] hover:shadow-glow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-expanded={showForm}
            aria-controls="add-task-form"
          >
            {showForm ? 'Cancel' : '+ Add Task'}
          </button>
        </div>

        {/* ── Add Task Form ───────────────────────────── */}
        {showForm && (
          <div id="add-task-form">
            <TaskForm onSubmit={addTask} submitLabel="Add Task" />
          </div>
        )}
      </section>

      {/* ── Task List ─────────────────────────────────── */}
      <section>
        <TaskList
          tasks={filteredAndSorted}
          onToggle={toggleTask}
          onEdit={editTask}
          onDelete={deleteTask}
        />
      </section>
    </main>
  )
}

export default App

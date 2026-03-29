import { useState } from 'react'
import TaskForm from './TaskForm'

/**
 * Priority badge color mapping.
 * Returns Tailwind classes for the priority pill.
 */
function priorityClasses(priority) {
  switch (priority) {
    case 'high':
      return 'border-priority-high/30 text-priority-high bg-priority-high/8'
    case 'low':
      return 'border-priority-low/30 text-priority-low bg-priority-low/8'
    default:
      return 'border-priority-medium/30 text-priority-medium bg-priority-medium/8'
  }
}

/**
 * TaskItem — Displays a single task with actions.
 *
 * Features:
 *  - Toggle completed status (checkbox)
 *  - Inline edit mode (click task or Edit button)
 *  - Delete with confirmation prompt
 *  - Visual distinction for completed tasks (dimmed + strikethrough)
 *  - Priority badge and optional due date display
 */
function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  /** Format a date string (YYYY-MM-DD) for display using Intl. */
  const formatDate = (dateStr) => {
    if (!dateStr) return null
    try {
      return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(dateStr + 'T00:00:00'))
    } catch {
      return dateStr
    }
  }

  /** Check if a due date is past today. */
  const isOverdue = (dateStr) => {
    if (!dateStr || task.completed) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return new Date(dateStr + 'T00:00:00') < today
  }

  /** Handle the edit form submission. */
  const handleEditSubmit = (data) => {
    onEdit(task.id, data)
    setIsEditing(false)
  }

  /** Handle delete with confirmation. */
  const handleDeleteClick = () => {
    setShowConfirm(true)
  }

  const confirmDelete = () => {
    onDelete(task.id)
    setShowConfirm(false)
  }

  // ── Edit Mode ──────────────────────────────────────────
  if (isEditing) {
    return (
      <li className="animate-fade-in">
        <TaskForm
          key={task.id}
          initialData={task}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditing(false)}
          submitLabel="Save Changes"
        />
      </li>
    )
  }

  // ── Display Mode ───────────────────────────────────────
  const overdue = isOverdue(task.dueDate)

  return (
    <li
      className={`group flex items-start gap-4 rounded-xl border bg-bg-elevated p-5 transition-[border-color,opacity] duration-200 ${
        task.completed
          ? 'border-border-default opacity-60'
          : 'border-border-default hover:border-border-hover'
      }`}
    >
      {/* Checkbox */}
      <label className="relative mt-0.5 flex shrink-0 cursor-pointer">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.name}" as ${task.completed ? 'incomplete' : 'complete'}`}
          className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-border-hover bg-transparent transition-[border-color,background-color] duration-150 checked:border-accent checked:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        {/* Checkmark icon */}
        <svg
          className="pointer-events-none absolute inset-0 h-5 w-5 text-bg opacity-0 peer-checked:opacity-100 transition-opacity duration-150"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </label>

      {/* Task content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={`text-sm font-semibold leading-snug ${
              task.completed ? 'line-through text-text-muted' : 'text-text-primary'
            }`}
          >
            {task.name}
          </h3>
          {/* Priority badge */}
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${priorityClasses(task.priority)}`}
          >
            {task.priority}
          </span>
        </div>

        <p
          className={`text-sm leading-relaxed ${
            task.completed ? 'line-through text-text-muted/60' : 'text-text-secondary'
          }`}
        >
          {task.description}
        </p>

        {/* Due date */}
        {task.dueDate && (
          <p
            className={`mt-1 font-mono text-xs ${
              overdue ? 'text-priority-high' : 'text-text-muted'
            }`}
          >
            {overdue ? 'Overdue: ' : 'Due: '}{formatDate(task.dueDate)}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-medium text-text-muted transition-[color,background-color] duration-150 hover:bg-bg-subtle hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
          aria-label={`Edit "${task.name}"`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDeleteClick}
          className="cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-medium text-text-muted transition-[color,background-color] duration-150 hover:bg-danger-bg hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
          aria-label={`Delete "${task.name}"`}
        >
          Delete
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 backdrop-blur-sm animate-fade-in"
          role="alertdialog"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-desc"
        >
          <div
            className="mx-4 flex w-full max-w-sm flex-col gap-4 rounded-xl border border-border-default bg-bg-elevated p-6 shadow-card animate-card-in"
            style={{ overscrollBehavior: 'contain' }}
          >
            <h3 id="confirm-title" className="text-base font-semibold">
              Delete Task
            </h3>
            <p id="confirm-desc" className="text-sm text-text-secondary">
              Are you sure you want to delete &ldquo;{task.name}&rdquo;? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={confirmDelete}
                className="cursor-pointer rounded-lg bg-danger px-5 py-2 text-sm font-semibold text-white touch-manipulation transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="cursor-pointer rounded-lg border border-border-default bg-transparent px-5 py-2 text-sm font-medium text-text-secondary touch-manipulation transition-[border-color,color] duration-150 hover:border-border-hover hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}

export default TaskItem

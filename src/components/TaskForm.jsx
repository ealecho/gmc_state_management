import { useState, useEffect, useRef } from 'react'

/**
 * TaskForm — Reusable form for adding and editing tasks.
 *
 * Props:
 *  - onSubmit(taskData)  — called with { name, description, priority, dueDate }
 *  - initialData         — if provided, pre-fills the form for editing.
 *                          To re-initialize when switching tasks, render with
 *                          a unique `key` prop (e.g. key={task.id}).
 *  - onCancel()          — called when the user cancels editing
 *  - submitLabel         — text for the submit button (default: "Add Task")
 */
function TaskForm({ onSubmit, initialData = null, onCancel = null, submitLabel = 'Add Task' }) {
  // Initialize state directly from props — no effect needed.
  // Parent components should use a `key` prop to reset this form
  // when `initialData` changes (e.g. switching between tasks to edit).
  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [priority, setPriority] = useState(initialData?.priority || 'medium')
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '')
  const [errors, setErrors] = useState({})
  const nameRef = useRef(null)

  // Focus the name input on mount
  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  /** Validate that both name and description are filled. */
  const validate = () => {
    const errs = {}
    if (!name.trim()) errs.name = 'Task name is required'
    if (!description.trim()) errs.description = 'Description is required'
    return errs
  }

  /** Clear error for a field as the user types. */
  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || null,
    })

    // Reset form only when adding (not editing)
    if (!initialData) {
      setName('')
      setDescription('')
      setPriority('medium')
      setDueDate('')
    }
    setErrors({})
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border border-border-default bg-bg-elevated p-6 shadow-card animate-card-in"
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Task Name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="task-name"
            className="text-xs font-medium uppercase tracking-widest text-text-muted"
          >
            Task Name
          </label>
          <input
            ref={nameRef}
            id="task-name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); clearError('name') }}
            placeholder="What needs to be done\u2026"
            autoComplete="off"
            className="rounded-lg border border-border-default bg-bg-input px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-border-color duration-150 focus-visible:border-accent focus-visible:outline-none"
          />
          {errors.name && (
            <p className="text-xs text-[#ef4444]">{errors.name}</p>
          )}
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="task-priority"
            className="text-xs font-medium uppercase tracking-widest text-text-muted"
          >
            Priority
          </label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="cursor-pointer rounded-lg border border-border-default bg-bg-input px-4 py-2.5 text-sm text-text-primary transition-border-color duration-150 focus-visible:border-accent focus-visible:outline-none"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Due Date */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label
            htmlFor="task-due"
            className="text-xs font-medium uppercase tracking-widest text-text-muted"
          >
            Due Date (optional)
          </label>
          <input
            id="task-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-lg border border-border-default bg-bg-input px-4 py-2.5 text-sm text-text-primary transition-border-color duration-150 focus-visible:border-accent focus-visible:outline-none"
          />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="task-description"
          className="text-xs font-medium uppercase tracking-widest text-text-muted"
        >
          Description
        </label>
        <textarea
          id="task-description"
          rows={3}
          value={description}
          onChange={(e) => { setDescription(e.target.value); clearError('description') }}
          placeholder="Add some details\u2026"
          autoComplete="off"
          className="resize-y rounded-lg border border-border-default bg-bg-input px-4 py-2.5 text-sm leading-relaxed text-text-primary placeholder:text-text-muted transition-border-color duration-150 focus-visible:border-accent focus-visible:outline-none"
        />
        {errors.description && (
          <p className="text-xs text-[#ef4444]">{errors.description}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-bg touch-manipulation transition-[opacity,transform] duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.97]"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-lg border border-border-default bg-transparent px-5 py-2.5 text-sm font-medium text-text-secondary touch-manipulation transition-[border-color,color] duration-150 hover:border-border-hover hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default TaskForm

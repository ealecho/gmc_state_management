/**
 * Filter — Controls for filtering tasks by status and sorting.
 *
 * Provides:
 *  - Status filter: All / Active / Completed
 *  - Sort by: Newest first / Priority / Due date
 */
function Filter({ statusFilter, sortBy, onStatusChange, onSortChange }) {
  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ]

  return (
    <div className="flex flex-wrap items-end gap-4">
      {/* Status filter — segmented control */}
      <fieldset className="flex flex-col gap-1.5">
        <legend className="text-xs font-medium uppercase tracking-widest text-text-muted">
          Status
        </legend>
        <div className="flex overflow-hidden rounded-lg border border-border-default" role="radiogroup">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={statusFilter === opt.value}
              onClick={() => onStatusChange(opt.value)}
              className={`cursor-pointer border-none px-4 py-2 text-xs font-medium touch-manipulation transition-[background-color,color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
                statusFilter === opt.value
                  ? 'bg-accent-bg text-accent'
                  : 'bg-transparent text-text-muted hover:bg-bg-subtle hover:text-text-secondary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Sort dropdown */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="sort-select"
          className="text-xs font-medium uppercase tracking-widest text-text-muted"
        >
          Sort By
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="cursor-pointer rounded-lg border border-border-default bg-bg-input px-4 py-2.5 text-sm text-text-primary transition-border-color duration-150 focus-visible:border-accent focus-visible:outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priority">Priority (High &rarr; Low)</option>
          <option value="dueDate">Due Date (Soonest)</option>
        </select>
      </div>
    </div>
  )
}

export default Filter

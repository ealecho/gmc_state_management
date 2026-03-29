import TaskItem from './TaskItem'

/**
 * TaskList — Renders the list of TaskItem components.
 *
 * Displays an empty state when no tasks match the current filters.
 * Receives the filtered/sorted task array and delegates actions
 * (toggle, edit, delete) up to the parent via props.
 */
function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-border-default bg-bg-elevated px-8 py-16 text-center">
        <p className="text-lg text-text-muted">No tasks found</p>
        <p className="text-sm text-text-muted/60">
          Try adjusting your filters or add a new task.
        </p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-3" role="list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

export default TaskList

import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'

type Todo = {
  id: number
  title: string
  completed: number
}

type Props = {
  todos: Todo[]
}

export default function Todos({ todos }: Props) {
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodoTitle.trim() || isAdding) return

    setIsAdding(true)
    try {
      const response = await fetch('/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          title: newTodoTitle.trim(),
          completed: 0
        })
      })

      if (response.ok) {
        setNewTodoTitle('')
        // Refresh the page to show the new todo
        router.visit('/todos')
      }
    } catch (error) {
      console.error('Failed to add todo:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const response = await fetch(`/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          ...todo,
          completed: todo.completed ? 0 : 1
        })
      })

      if (response.ok) {
        // Refresh the page to show the updated todo
        router.visit('/todos')
      }
    } catch (error) {
      console.error('Failed to update todo:', error)
    }
  }

  return (
    <div>
      <Head title="Todos" />
      <h1>Todo List</h1>

      <div style={{ marginBottom: '20px' }}>
        <Link href="/">← Back to Home</Link>
      </div>

      {/* Add new todo form */}
      <form onSubmit={handleAddTodo} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Enter a new todo..."
          style={{ marginRight: '10px', padding: '5px' }}
          disabled={isAdding}
        />
        <button type="submit" disabled={isAdding || !newTodoTitle.trim()}>
          {isAdding ? 'Adding...' : 'Add Todo'}
        </button>
      </form>

      {/* Todo list */}
      {todos.length === 0 ? (
        <p>No todos yet. Add one above!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map(todo => (
            <li key={todo.id} style={{
              marginBottom: '10px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={todo.completed === 1}
                  onChange={() => handleToggleComplete(todo)}
                  style={{ marginRight: '10px' }}
                />
                <span style={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#666' : 'inherit'
                }}>
                  {todo.title}
                </span>
              </div>
              <Link href={`/todos/${todo.id}`} style={{ color: '#0066cc' }}>
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

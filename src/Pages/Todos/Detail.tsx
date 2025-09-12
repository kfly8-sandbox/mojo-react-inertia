import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'

type Todo = {
  id: number
  title: string
  completed: number
}

type Props = {
  todo: Todo
}

export default function TodoDetail({ todo }: Props) {
  const [title, setTitle] = useState(todo.title)
  const [completed, setCompleted] = useState(todo.completed === 1)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || isUpdating) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          title: title.trim(),
          completed: completed ? 1 : 0
        })
      })

      if (response.ok) {
        // Navigate back to todos list
        router.visit('/todos')
      } else {
        console.error('Failed to update todo')
      }
    } catch (error) {
      console.error('Failed to update todo:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div>
      <Head title={`Todo: ${todo.title}`} />
      <h1>Todo Details</h1>

      <div style={{ marginBottom: '20px' }}>
        <Link href="/todos">← Back to Todos</Link>
      </div>

      <form onSubmit={handleUpdate} style={{ maxWidth: '400px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Todo ID: <strong>{todo.id}</strong>
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Title:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            disabled={isUpdating}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              style={{ marginRight: '8px' }}
              disabled={isUpdating}
            />
            Completed
          </label>
        </div>

        <button
          type="submit"
          disabled={isUpdating || !title.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: isUpdating || !title.trim() ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isUpdating || !title.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          {isUpdating ? 'Updating...' : 'Update Todo'}
        </button>
      </form>

      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
      }}>
        <h3>Current Status:</h3>
        <p><strong>Title:</strong> {todo.title}</p>
        <p><strong>Completed:</strong> {todo.completed ? 'Yes' : 'No'}</p>
      </div>
    </div>
  )
}

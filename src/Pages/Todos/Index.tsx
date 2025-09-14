import { Head, Link, Form, router } from '@inertiajs/react'

type Todo = {
  id: number
  title: string
  completed: number
}

type Props = {
  todos: Todo[]
}

export default function Todos({ todos }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Head title="Todos" />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Todo List</h1>

        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
            ← Back to Home
          </Link>
        </div>

        {/* Add new todo form */}
        <Form action="/todos" method="post" className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              name="title"
              placeholder="Enter a new todo..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Todo
            </button>
          </div>
        </Form>

        {/* Todo list */}
        {todos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No todos yet. Add one above!</p>
        ) : (
          <ul className="space-y-2">
            {todos.map(todo => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function TodoItem({ todo }: { todo: Todo }) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.post(`/todos/${todo.id}`, {
      completed: e.target.checked ? 1 : 0
    })
  }

  return (
    <li className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            defaultChecked={todo.completed === 1}
            onChange={handleCheckboxChange}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className={`text-gray-800 ${todo.completed === 1 ? 'line-through text-gray-500' : ''}`}>
            {todo.title}
          </span>
        </div>
        <Link
          href={`/todos/${todo.id}`}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          View Details
        </Link>
      </div>
    </li>
  )
}

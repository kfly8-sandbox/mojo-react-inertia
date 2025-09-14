import { Head, Link, Form } from '@inertiajs/react'

type Todo = {
  id: number
  title: string
  completed: number
}

type Props = {
  todo: Todo
}

export default function TodoDetail({ todo }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Head title={`Todo: ${todo.title}`} />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Todo Details</h1>

        <div className="mb-6">
          <Link href="/todos" className="text-blue-600 hover:text-blue-800 transition-colors">
            ← Back to Todos
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <Form action={`/todos/${todo.id}`} method="post" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Todo ID
              </label>
              <div className="text-lg font-semibold text-gray-900">#{todo.id}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                defaultValue={todo.title}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="completed"
                  defaultChecked={todo.completed === 1}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">Completed</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Update Todo
            </button>
          </Form>
        </div>
      </div>
    </div>
  )
}

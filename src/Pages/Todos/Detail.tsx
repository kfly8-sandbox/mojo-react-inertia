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
    <div>
      <Head title={`Todo: ${todo.title}`} />
      <h1>Todo Details</h1>

      <div>
        <Link href="/todos">← Back to Todos</Link>
      </div>

      <Form action={`/todos/${todo.id}`} method="post">
        <div>
          <label>
            Todo ID: <strong>{todo.id}</strong>
          </label>
        </div>

        <div>
          <label>
            Title:
          </label>
          <input
            type="text"
            name="title"
            defaultValue={todo.title}
          />
        </div>

        <div>
          <label id="completed">
            <input
              type="checkbox"
              name="completed"
              defaultChecked={todo.completed === 1}
            />
            Completed
          </label>
        </div>

        <button
          type="submit"
        >
          Update Todo
        </button>
      </Form>

      <div>
        <h3>Current Status:</h3>
        <p><strong>Title:</strong> {todo.title}</p>
        <p><strong>Completed:</strong> {todo.completed ? 'Yes' : 'No'}</p>
      </div>
    </div>
  )
}

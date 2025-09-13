import { Head, Link, Form, useForm } from '@inertiajs/react'

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
    <div>
      <Head title="Todos" />
      <h1>Todo List</h1>

      <div>
        <Link href="/">← Back to Home</Link>
      </div>

      {/* Add new todo form */}
      <Form action="/todos" method="post">
        <input
          type="text"
          name="title"
          placeholder="Enter a new todo..."
        />
        <button type="submit">Add Todo</button>
      </Form>

      {/* Todo list */}
      {todos.length === 0 ? (
        <p>No todos yet. Add one above!</p>
      ) : (
        <ul>
          {todos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      )}
    </div>
  )
}

function TodoItem({ todo }: { todo: Todo }) {
  const { data, setData, post } = useForm({
    completed: todo.completed
  })

  const handleCheckboxChange = () => {
    const newValue = data.completed === 1 ? 0 : 1
    setData('completed', newValue)
    post(`/todos/${todo.id}`)
  }

  return (
    <li>
      <div>
        <input
          type="checkbox"
          checked={data.completed === 1}
          onChange={handleCheckboxChange}
        />
        <span style={{ textDecoration: data.completed === 1 ? 'line-through' : 'none' }}>
          {todo.title}
        </span>
      </div>
      <Link href={`/todos/${todo.id}`}>
        View Details
      </Link>
    </li>
  )
}

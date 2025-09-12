import { Head } from '@inertiajs/react'

type Props = {
  user: {
    name: string
  }
}

export default function Hello({ user }: Props) {
  return (
    <div>
      <Head title="Hello" />
      <h1>Welcome</h1>
      <p>Hello {user.name}, welcome to your first Inertia app!</p>
    </div>
  )
}

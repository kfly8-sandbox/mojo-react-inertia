import { Head, Link } from '@inertiajs/react'

type Props = {
  user: {
    name: string
  }
}

export default function Hello({ user }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Head title="Hello" />
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome</h1>
          <p className="text-gray-700">
            Hello {user.name}, welcome to your first Inertia app!
          </p>
        </div>
      </div>
    </div>
  )
}

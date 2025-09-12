import { Head, Link } from '@inertiajs/react'

export default function Index() {
  return (
    <div>
      <Head title="Home" />
      <h1>Mojolicious + React + Inertia.js</h1>
      <p>Welcome to your Inertia.js application!</p>

      <h2>Available Pages:</h2>
      <ul>
        <li>
          <Link href="/hello">Hello Page</Link>
        </li>
        <li>
          <Link href="/todos">Todos Page</Link>
        </li>
      </ul>

      <p>
        Click on the links above to navigate using Inertia.js.
        The page will update without a full page reload.
      </p>
    </div>
  )
}

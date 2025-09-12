import { createRoot } from 'react-dom/client'
import './index.css'
import { createInertiaApp } from '@inertiajs/react'

async function initializeApp() {
  try {
    const path = window.location.pathname || '/'

    const response = await fetch(path, {
      headers: {
        'X-Inertia': 'true',
        'X-Inertia-Version': '1',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch initial page: ${response.status}`)
    }

    const pageData = await response.json()

    const appElement = document.getElementById('app')
    if (appElement) {
      appElement.setAttribute('data-page', JSON.stringify(pageData))
    }

    // Inertiaアプリを作成
    createInertiaApp({
      id: 'app',
      resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true })
        return pages[`./Pages/${name}.tsx`]
      },
      setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
      },
    })
  } catch (error) {
    console.error('Failed to initialize app:', error)
    // エラー時はフォールバックページを表示
    document.getElementById('app')!.innerHTML = '<h1>Failed to load application</h1>'
  }
}

initializeApp()

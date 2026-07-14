import type { ReactNode } from 'react'
import { useRouter } from '@tanstack/react-router'

export function AppHeader({ title, action }: { title: string; action?: ReactNode }) {
  const router = useRouter()
  return (
    <header className="appbar">
      <button className="appbar__back" onClick={() => router.history.back()}>
        ‹
      </button>
      <h1 className="appbar__title">{title}</h1>
      <div className="appbar__action">{action}</div>
    </header>
  )
}
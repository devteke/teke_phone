import { useEffect, useRef } from 'react'

type Handler<T> = (data: T) => void

// client -> NUI (SendNuiMessage) mesajlarını dinler
export function useNuiEvent<T = unknown>(action: string, handler: Handler<T>): void {
  const saved = useRef<Handler<T>>(handler)
  saved.current = handler

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      const payload = event.data ?? {}
      if (payload.action === action) saved.current(payload.data as T)
    }
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [action])
}
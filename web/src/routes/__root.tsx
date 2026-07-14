import { useEffect } from 'react'
import { Outlet } from '@tanstack/react-router'
import { useNuiEvent } from '../hooks/useNuiEvent'
import { useIncomingMessages } from '../hooks/useIncomingMessages'
import { fetchNui } from '../lib/fetchNui'

import { usePhoneStore, type PhoneData } from '../store/phone.store'

export function RootLayout() {
  const visible = usePhoneStore((s) => s.visible)
  const setVisible = usePhoneStore((s) => s.setVisible)
  const setPhone = usePhoneStore((s) => s.setPhone)

  useNuiEvent<boolean>('setVisible', setVisible)
  useNuiEvent<PhoneData>('setPhoneData', setPhone)

  // Gelen mesaj push'larini dinle
  useIncomingMessages()

  // ESC ile kapat
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') void fetchNui('close')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!visible) return null

  return (
    <div className="phone">
      <div className="phone__frame">
        <Outlet />
      </div>
    </div>
  )
}
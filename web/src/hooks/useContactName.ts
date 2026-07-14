import { useMemo } from 'react'
import { useContactNames } from './useContacts'

// Numara -> rehber ismi. Kaynak: hafif contactNames haritasi (sayfalamadan bagimsiz).
export function useResolveName() {
  const { data: contacts = [] } = useContactNames()
  const byNumber = useMemo(() => {
    const m = new Map<string, string>()
    for (const c of contacts) m.set(c.phoneNumber, c.name)
    return m
  }, [contacts])
  return (phoneNumber: string): string => byNumber.get(phoneNumber) ?? phoneNumber
}
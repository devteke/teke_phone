import { useMemo } from 'react'
import { useContacts } from './useContacts'

// Numara -> rehber ismi. Kaynak: tam contacts listesi (sections/search ile ayni veri).
export function useResolveName() {
  const { data: contacts = [] } = useContacts()
  const byNumber = useMemo(() => {
    const m = new Map<string, string>()
    for (const c of contacts) m.set(c.phoneNumber, c.name)
    return m
  }, [contacts])
  return (phoneNumber: string): string => byNumber.get(phoneNumber) ?? phoneNumber
}
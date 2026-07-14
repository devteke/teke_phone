import { useMemo } from 'react'
import { useContacts } from './useContacts'

// Numara -> rehber ismi cozumu. Tamamen client cache'ten (useContacts) turer.
// Rehbere ekleme/silme aninda ['contacts'] cache guncellenince her yer otomatik yenilenir.
export function useResolveName() {
  const { data: contacts = [] } = useContacts()

  const byNumber = useMemo(() => {
    const map = new Map<string, string>()
    for (const c of contacts) map.set(c.phoneNumber, c.name)
    return map
  }, [contacts])

  return (phoneNumber: string): string => byNumber.get(phoneNumber) ?? phoneNumber
}
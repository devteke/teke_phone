import { useQueryClient } from '@tanstack/react-query'
import { useNuiEvent } from './useNuiEvent'
import type { Message } from '../types'

// Sunucudan gelen anlik mesajlari (newMessage) cache'e isler.
export function useIncomingMessages() {
  const qc = useQueryClient()
  useNuiEvent<Message>('newMessage', (msg) => {
    const partner = msg.senderNumber // bana gelen: karsi taraf = gonderen
    qc.setQueryData<Message[]>(['messages', partner], (old) => [...(old ?? []), msg])
    qc.invalidateQueries({ queryKey: ['conversations'] })
  })
}
import { useQueryClient } from '@tanstack/react-query'
import { useNuiEvent } from './useNuiEvent'
import { appendMessageToThread, bumpConversation } from './useMessages'
import type { Message } from '../types'

// Sunucudan gelen anlik mesajlari cache'e isler (DB'ye gitmeden).
export function useIncomingMessages() {
  const qc = useQueryClient()
  useNuiEvent<Message>('newMessage', (msg) => {
    const partner = msg.senderNumber // bana gelen: karsi taraf = gonderen
    appendMessageToThread(qc, partner, msg)
    bumpConversation(qc, {
      partner,
      content: msg.content,
      time: msg.createdAt,
      incoming: true,
    })
  })
}
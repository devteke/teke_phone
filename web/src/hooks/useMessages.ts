import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '../api/messages'
import type { Message } from '../types'

export function useConversations() {
  return useQuery({ queryKey: ['conversations'], queryFn: api.getConversations })
}

export function useThread(partner: string) {
  return useQuery({
    queryKey: ['messages', partner],
    queryFn: () => api.getMessages(partner),
    enabled: !!partner,
  })
}

export function useSendMessage(partner: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => api.sendMessage(partner, content),
    onSuccess: (msg) => {
      if (msg) {
        qc.setQueryData<Message[]>(['messages', partner], (old) => [...(old ?? []), msg])
      }
      qc.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}
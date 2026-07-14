import { useCallback } from 'react'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from '@tanstack/react-query'
import * as api from '../api/messages'
import type { Conversation, Message, Page } from '../types'

const PAGE_SIZE = 20
type ThreadCache = InfiniteData<Page<Message>, number>

export function useConversations() {
  return useQuery({ queryKey: ['conversations'], queryFn: api.getConversations })
}

export function useThread(partner: string) {
  return useInfiniteQuery({
    queryKey: ['messages', partner],
    queryFn: ({ pageParam }) => api.getMessages(partner, pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined, // daha eski sayfa
    enabled: !!partner,
  })
}

// Yeni mesaji sohbet cache'inin EN YENI sayfasina ekler (DB'ye gitmeden)
export function appendMessageToThread(qc: QueryClient, partner: string, msg: Message) {
  qc.setQueryData<ThreadCache>(['messages', partner], (old) => {
    if (!old) return old // sohbet hic acilmadiysa dokunma (acilinca DB'den gelir)
    const exists = old.pages.some((p) => p.items.some((m) => m.id === msg.id))
    if (exists) return old
    const pages = old.pages.slice()
    pages[0] = { ...pages[0]!, items: [...pages[0]!.items, msg] }
    return { ...old, pages }
  })
}

// Konusma listesini client-side gunceller (DB'ye gitmeden)
export function bumpConversation(
  qc: QueryClient,
  opts: { partner: string; content: string; time: string; incoming: boolean },
) {
  qc.setQueryData<Conversation[]>(['conversations'], (old) => {
    const list = old ? old.slice() : []
    const idx = list.findIndex((c) => c.phoneNumber === opts.partner)
    if (idx >= 0) {
      const conv = list[idx]!
      const updated: Conversation = {
        ...conv,
        lastMessage: opts.content,
        lastTime: opts.time,
        unread: opts.incoming ? conv.unread + 1 : conv.unread,
      }
      list.splice(idx, 1)
      return [updated, ...list] // en uste tasi
    }
    return [
      {
        phoneNumber: opts.partner,
        displayName: opts.partner,
        lastMessage: opts.content,
        lastTime: opts.time,
        unread: opts.incoming ? 1 : 0,
      },
      ...list,
    ]
  })
}

export function useSendMessage(partner: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => api.sendMessage(partner, content),
    onSuccess: (msg) => {
      if (!msg) return
      appendMessageToThread(qc, partner, msg)
      bumpConversation(qc, { partner, content: msg.content, time: msg.createdAt, incoming: false })
    },
  })
}

// Sohbeti acinca okundu isaretle (badge'i sifirla)
export function useMarkConversationRead(partner: string) {
  const qc = useQueryClient()
  return useCallback(() => {
    qc.setQueryData<Conversation[]>(['conversations'], (old) =>
      old?.map((c) => (c.phoneNumber === partner ? { ...c, unread: 0 } : c)),
    )
  }, [qc, partner])
}
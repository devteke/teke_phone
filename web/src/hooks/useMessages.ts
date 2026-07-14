import { useCallback } from 'react'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from '@tanstack/react-query'
import * as api from '../api/messages'
import type { Conversation, Message, Page } from '../types'

const MESSAGE_PAGE = 20
const CONV_PAGE = 15
type ThreadCache = InfiniteData<Page<Message>, number>
type ConvCache = InfiniteData<Page<Conversation>, number>

export function useConversations() {
  return useInfiniteQuery({
    queryKey: ['conversations'],
    queryFn: ({ pageParam }) => api.getConversations(pageParam, CONV_PAGE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
}

export function useThread(partner: string) {
  return useInfiniteQuery({
    queryKey: ['messages', partner],
    queryFn: ({ pageParam }) => api.getMessages(partner, pageParam, MESSAGE_PAGE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined, // daha eski
    enabled: !!partner,
  })
}

export function appendMessageToThread(qc: QueryClient, partner: string, msg: Message) {
  qc.setQueryData<ThreadCache>(['messages', partner], (old) => {
    if (!old) return old
    const exists = old.pages.some((p) => p.items.some((m) => m.id === msg.id))
    if (exists) return old
    const pages = old.pages.slice()
    pages[0] = { ...pages[0]!, items: [...pages[0]!.items, msg] }
    return { ...old, pages }
  })
}

// Konusma listesini (infinite cache) DB'siz gunceller
export function bumpConversation(
  qc: QueryClient,
  opts: { partner: string; content: string; time: string; incoming: boolean },
) {
  qc.setQueryData<ConvCache>(['conversations'], (old) => {
    if (!old) return old // liste hic yuklenmediyse dokunma (acilinca DB'den gelir)
    let found: Conversation | undefined
    const pages = old.pages.map((pg) => ({
      ...pg,
      items: pg.items.filter((c) => {
        if (c.phoneNumber === opts.partner) {
          found = c
          return false
        }
        return true
      }),
    }))
    const base: Conversation =
      found ?? { phoneNumber: opts.partner, displayName: opts.partner, lastMessage: '', lastTime: '', unread: 0 }
    const updated: Conversation = {
      ...base,
      lastMessage: opts.content,
      lastTime: opts.time,
      unread: opts.incoming ? base.unread + 1 : base.unread,
    }
    pages[0] = { ...pages[0]!, items: [updated, ...pages[0]!.items] }
    return { ...old, pages }
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

export function useMarkConversationRead(partner: string) {
  const qc = useQueryClient()
  return useCallback(() => {
    qc.setQueryData<ConvCache>(['conversations'], (old) => {
      if (!old) return old
      return {
        ...old,
        pages: old.pages.map((pg) => ({
          ...pg,
          items: pg.items.map((c) => (c.phoneNumber === partner ? { ...c, unread: 0 } : c)),
        })),
      }
    })
  }, [qc, partner])
}
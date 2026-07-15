import { fetchNui } from '../lib/fetchNui'
import type { Conversation, Message, Page, Thread } from '../types'

export const getConversations = (offset: number, limit: number) =>
  fetchNui<Page<Conversation>>('getConversations', { offset, limit })

export const getMessages = (partner: string, beforeId: number, limit: number) =>
  fetchNui<Thread>('getMessages', { partner, beforeId, limit })

export const sendMessage = (to: string, content: string) =>
  fetchNui<Message>('sendMessage', { to, content })
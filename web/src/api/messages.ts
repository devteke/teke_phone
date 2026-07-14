import { fetchNui } from '../lib/fetchNui'
import type { Conversation, Message, Page } from '../types'

export const getConversations = () => fetchNui<Conversation[]>('getConversations')

export const getMessages = (partner: string, beforeId: number, limit: number) =>
  fetchNui<Page<Message>>('getMessages', { partner, beforeId, limit })

export const sendMessage = (to: string, content: string) =>
  fetchNui<Message>('sendMessage', { to, content })
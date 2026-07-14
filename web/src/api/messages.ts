import { fetchNui } from '../lib/fetchNui'
import type { Conversation, Message } from '../types'

export const getConversations = () => fetchNui<Conversation[]>('getConversations')
export const getMessages = (partner: string) => fetchNui<Message[]>('getMessages', partner)
export const sendMessage = (to: string, content: string) =>
  fetchNui<Message>('sendMessage', { to, content })
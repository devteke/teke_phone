import type { Conversation, Message, Page } from '../../shared/types'
import { messagesRepo, type MessageRow } from '../db/messages.repo'

function toMessage(row: MessageRow, myNumber: string): Message {
  return {
    id: row.id,
    senderNumber: row.sender_number,
    receiverNumber: row.receiver_number,
    content: row.content,
    createdAt: row.created_at,
    isMine: row.sender_number === myNumber,
  }
}

export const messagesService = {
  async conversations(myNumber: string, limit: number, offset: number): Promise<Page<Conversation>> {
    const rows = await messagesRepo.conversations(myNumber, limit, offset)
    const items: Conversation[] = rows.map((r) => ({
      phoneNumber: r.partner_number,
      displayName: r.partner_number, // isim cozumu NUI'de (contactNames)
      lastMessage: r.last_message,
      lastTime: r.last_time,
      unread: Number(r.unread) || 0,
    }))
    const nextCursor = rows.length === limit ? offset + limit : null
    return { items, nextCursor }
  },

  async thread(myNumber: string, partnerNumber: string, beforeId: number, limit: number): Promise<Page<Message>> {
    const rows = await messagesRepo.thread(myNumber, partnerNumber, beforeId, limit)
    if (beforeId === 0) await messagesRepo.markRead(myNumber, partnerNumber)
    const items = rows.map((r) => toMessage(r, myNumber)).reverse()
    const nextCursor = rows.length === limit ? rows[rows.length - 1]!.id : null
    return { items, nextCursor }
  },

  async send(fromNumber: string, toNumber: string, content: string): Promise<Message | null> {
    const trimmed = (content ?? '').trim()
    const to = (toNumber ?? '').trim()
    if (!trimmed || !to) return null
    const id = await messagesRepo.insert(fromNumber, to, trimmed)
    return { id, senderNumber: fromNumber, receiverNumber: to, content: trimmed, createdAt: new Date().toISOString(), isMine: true }
  },
}
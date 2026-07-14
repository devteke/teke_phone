import type { Conversation, Message } from '../../shared/types'
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
  async conversations(myNumber: string): Promise<Conversation[]> {
    const rows = await messagesRepo.conversations(myNumber)
    return rows.map((r) => ({
      phoneNumber: r.partner_number,
      displayName: r.partner_name || r.partner_number, // rehberde varsa isim
      lastMessage: r.last_message,
      lastTime: r.last_time,
      unread: Number(r.unread) || 0,
    }))
  },

  async thread(myNumber: string, partnerNumber: string): Promise<Message[]> {
    const rows = await messagesRepo.thread(myNumber, partnerNumber)
    await messagesRepo.markRead(myNumber, partnerNumber)
    return rows.map((r) => toMessage(r, myNumber))
  },

  async send(fromNumber: string, toNumber: string, content: string): Promise<Message | null> {
    const trimmed = (content ?? '').trim()
    const to = (toNumber ?? '').trim()
    if (!trimmed || !to) return null
    const id = await messagesRepo.insert(fromNumber, to, trimmed)
    return {
      id,
      senderNumber: fromNumber,
      receiverNumber: to,
      content: trimmed,
      createdAt: new Date().toISOString(),
      isMine: true,
    }
  },
}
import { onClientCallback } from '@overextended/ox_lib/server'
import { Events } from '../../shared/events'
import type { Conversation, Message, Page, Thread } from '../../shared/types'
import { resolveIdentity, onlineSourceByNumber } from './identity'
import { messagesService } from './messages.service'

export function registerMessageCallbacks(): void {
  onClientCallback(
    Events.getConversations,
    async (source: number, payload: { limit?: number; offset?: number }): Promise<Page<Conversation>> => {
      const me = await resolveIdentity(source)
      if (!me) return { items: [], nextCursor: null }
      const limit = Math.min(Math.max(payload?.limit ?? 15, 1), 50)
      const offset = Math.max(payload?.offset ?? 0, 0)
      return messagesService.conversations(me.phoneNumber, limit, offset)
    },
  )

  onClientCallback(
    Events.getMessages,
    async (source: number, payload: { partner: string; beforeId?: number; limit?: number }): Promise<Thread> => {
      const me = await resolveIdentity(source)
      const partner = payload?.partner
      if (!me || !partner) return { items: [], nextCursor: null, partnerName: partner ?? '' }
      const limit = Math.min(Math.max(payload?.limit ?? 20, 1), 50)
      const beforeId = payload?.beforeId ?? 0
      return messagesService.thread(me.phoneNumber, partner, beforeId, limit)
    },
  )

  onClientCallback(
    Events.sendMessage,
    async (source: number, payload: { to: string; content: string }): Promise<Message | null> => {
      const me = await resolveIdentity(source)
      if (!me) return null
      const message = await messagesService.send(me.phoneNumber, payload?.to, payload?.content)
      if (!message) return null
      const receiverSource = await onlineSourceByNumber(message.receiverNumber)
      if (receiverSource) emitNet(Events.newMessage, receiverSource, { ...message, isMine: false })
      return message
    },
  )
}
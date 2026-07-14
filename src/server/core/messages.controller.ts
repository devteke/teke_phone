import { onClientCallback } from '@overextended/ox_lib/server'
import { Events } from '../../shared/events'
import type { Conversation, Message, Page } from '../../shared/types'
import { resolveIdentity, onlineSourceByNumber } from './identity'
import { messagesService } from './messages.service'

export function registerMessageCallbacks(): void {
  onClientCallback(Events.getConversations, async (source: number): Promise<Conversation[]> => {
    const me = await resolveIdentity(source)
    if (!me) return []
    return messagesService.conversations(me.phoneNumber)
  })

  onClientCallback(
    Events.getMessages,
    async (
      source: number,
      payload: { partner: string; beforeId?: number; limit?: number },
    ): Promise<Page<Message>> => {
      const me = await resolveIdentity(source)
      const partner = payload?.partner
      if (!me || !partner) return { items: [], nextCursor: null }
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

      // Alici cevrimiciyse anlik ilet (onun bakis acisiyla isMine = false)
      const receiverSource = await onlineSourceByNumber(message.receiverNumber)
      if (receiverSource) {
        emitNet(Events.newMessage, receiverSource, { ...message, isMine: false })
      }

      return message // gonderen icin isMine = true
    },
  )
}
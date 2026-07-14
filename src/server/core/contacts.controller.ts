import { onClientCallback } from '@overextended/ox_lib/server'
import { Events } from '../../shared/events'
import type { Contact, PagedList } from '../../shared/types'
import { resolveIdentity } from './identity'
import { contactsService } from './contacts.service'

export function registerContactCallbacks(): void {
  onClientCallback(
    Events.getContacts,
    async (source: number, payload: { offset?: number; limit?: number }): Promise<PagedList<Contact>> => {
      const me = await resolveIdentity(source)
      if (!me) return { items: [], total: 0 }
      const limit = Math.min(Math.max(payload?.limit ?? 15, 1), 50)
      const offset = Math.max(payload?.offset ?? 0, 0)
      return contactsService.list(me.phoneNumber, limit, offset)
    },
  )

  onClientCallback(Events.getContactNames, async (source: number): Promise<Contact[]> => {
    const me = await resolveIdentity(source)
    if (!me) return []
    return contactsService.names(me.phoneNumber)
  })

  onClientCallback(
    Events.saveContact,
    async (source: number, input: { name?: string; phoneNumber?: string }): Promise<void> => {
      const me = await resolveIdentity(source)
      if (!me) return
      await contactsService.save(me.phoneNumber, input ?? {})
    },
  )

  onClientCallback(
    Events.deleteContact,
    async (source: number, input: { id: number }): Promise<void> => {
      const me = await resolveIdentity(source)
      if (!me) return
      await contactsService.remove(me.phoneNumber, input?.id)
    },
  )
}
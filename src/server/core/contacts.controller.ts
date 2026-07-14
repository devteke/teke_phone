import { onClientCallback } from '@overextended/ox_lib/server'
import { Events } from '../../shared/events'
import type { Contact } from '../../shared/types'
import { resolveIdentity } from './identity'
import { contactsService } from './contacts.service'

export function registerContactCallbacks(): void {
  onClientCallback(Events.getContacts, async (source: number): Promise<Contact[]> => {
    const me = await resolveIdentity(source)
    if (!me) return []
    return contactsService.list(me.phoneNumber)
  })

  onClientCallback(
    Events.saveContact,
    async (source: number, input: { name?: string; phoneNumber?: string }): Promise<Contact[]> => {
      const me = await resolveIdentity(source)
      if (!me) return []
      return contactsService.save(me.phoneNumber, input ?? {})
    },
  )

  onClientCallback(
    Events.deleteContact,
    async (source: number, input: { id: number }): Promise<Contact[]> => {
      const me = await resolveIdentity(source)
      if (!me) return []
      return contactsService.remove(me.phoneNumber, input?.id)
    },
  )
}
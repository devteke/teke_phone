import type { Contact } from '../../shared/types'
import { contactsRepo, type ContactRow } from '../db/contacts.repo'

function toContact(row: ContactRow): Contact {
  return { id: row.id, name: row.name, phoneNumber: row.phone_number }
}

export const contactsService = {
  async list(ownerNumber: string): Promise<Contact[]> {
    return (await contactsRepo.list(ownerNumber)).map(toContact)
  },

  // Ekleme/silme sonrasi guncel listeyi doner -> NUI cache'i kolayca tazelenir.
  async save(ownerNumber: string, input: { name?: string; phoneNumber?: string }): Promise<Contact[]> {
    const name = (input?.name ?? '').trim()
    const number = (input?.phoneNumber ?? '').trim()
    if (name && number) await contactsRepo.insert(ownerNumber, name, number)
    return this.list(ownerNumber)
  },

  async remove(ownerNumber: string, id: number): Promise<Contact[]> {
    if (id) await contactsRepo.remove(ownerNumber, id)
    return this.list(ownerNumber)
  },
}
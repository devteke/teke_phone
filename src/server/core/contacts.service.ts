import type { Contact } from '../../shared/types'
import { contactsRepo, type ContactRow } from '../db/contacts.repo'

function toContact(row: ContactRow): Contact {
  return { id: row.id, name: row.name, phoneNumber: row.phone_number, favorite: !!row.is_favorite }
}

export const contactsService = {
  async list(ownerNumber: string): Promise<Contact[]> {
    return (await contactsRepo.list(ownerNumber)).map(toContact)
  },

  async save(ownerNumber: string, input: { name?: string; phoneNumber?: string }): Promise<void> {
    const name = (input?.name ?? '').trim()
    const number = (input?.phoneNumber ?? '').trim()
    if (name && number) await contactsRepo.insert(ownerNumber, name, number)
  },

  async remove(ownerNumber: string, id: number): Promise<void> {
    if (id) await contactsRepo.remove(ownerNumber, id)
  },

  async setFavorite(ownerNumber: string, id: number, favorite: boolean): Promise<void> {
    if (id) await contactsRepo.setFavorite(ownerNumber, id, favorite)
  },
}
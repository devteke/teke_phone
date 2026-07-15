import type { Contact, PagedList } from '../../shared/types'
import { contactsRepo, type ContactRow } from '../db/contacts.repo'

function toContact(row: ContactRow): Contact {
  return { id: row.id, name: row.name, phoneNumber: row.phone_number, favorite: !!row.is_favorite }
}

export const contactsService = {
  async list(
    ownerNumber: string,
    favoritesOnly: boolean,
    search: string,
    limit: number,
    offset: number,
  ): Promise<PagedList<Contact>> {
    const [rows, total] = await Promise.all([
      contactsRepo.listPage(ownerNumber, favoritesOnly, search, limit, offset),
      contactsRepo.count(ownerNumber, favoritesOnly, search),
    ])
    return { items: rows.map(toContact), total }
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
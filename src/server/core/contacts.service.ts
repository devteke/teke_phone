import type { Contact, PagedList } from '../../shared/types'
import { contactsRepo, type ContactRow } from '../db/contacts.repo'

function toContact(row: ContactRow): Contact {
  return { id: row.id, name: row.name, phoneNumber: row.phone_number }
}

export const contactsService = {
  async list(ownerNumber: string, limit: number, offset: number): Promise<PagedList<Contact>> {
    const [rows, total] = await Promise.all([
      contactsRepo.page(ownerNumber, limit, offset),
      contactsRepo.count(ownerNumber),
    ])
    return { items: rows.map(toContact), total }
  },

  async names(ownerNumber: string): Promise<Contact[]> {
    const rows = await contactsRepo.names(ownerNumber)
    return rows.map((r) => ({ id: 0, name: r.name, phoneNumber: r.phone_number }))
  },

  async save(ownerNumber: string, input: { name?: string; phoneNumber?: string }): Promise<void> {
    const name = (input?.name ?? '').trim()
    const number = (input?.phoneNumber ?? '').trim()
    if (name && number) await contactsRepo.insert(ownerNumber, name, number)
  },

  async remove(ownerNumber: string, id: number): Promise<void> {
    if (id) await contactsRepo.remove(ownerNumber, id)
  },
}
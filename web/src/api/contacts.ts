import { fetchNui } from '../lib/fetchNui'
import type { Contact, PagedList } from '../types'

export const getContacts = (offset: number, limit: number) =>
  fetchNui<PagedList<Contact>>('getContacts', { offset, limit })

export const getContactNames = () => fetchNui<Contact[]>('getContactNames')

export const saveContact = (input: { name: string; phoneNumber: string }) =>
  fetchNui('saveContact', input)

export const deleteContact = (id: number) => fetchNui('deleteContact', { id })
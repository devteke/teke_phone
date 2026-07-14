import { fetchNui } from '../lib/fetchNui'
import type { Contact } from '../types'

export const getContacts = () => fetchNui<Contact[]>('getContacts')
export const saveContact = (input: { name: string; phoneNumber: string }) =>
  fetchNui<Contact[]>('saveContact', input)
export const deleteContact = (id: number) => fetchNui<Contact[]>('deleteContact', { id })
import { fetchNui } from '../lib/fetchNui'
import type { Contact } from '../types'

export const getContacts = () => fetchNui<Contact[]>('getContacts')

export const saveContact = (input: { name: string; phoneNumber: string }) =>
  fetchNui('saveContact', input)

export const deleteContact = (id: number) => fetchNui('deleteContact', { id })

export const setFavorite = (id: number, favorite: boolean) =>
  fetchNui('setFavorite', { id, favorite })
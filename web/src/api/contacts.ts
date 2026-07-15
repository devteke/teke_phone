import { fetchNui } from '../lib/fetchNui'
import type { Contact, PagedList } from '../types'

export const getContacts = (offset: number, limit: number, favoritesOnly = false, search = '') =>
  fetchNui<PagedList<Contact>>('getContacts', { offset, limit, favoritesOnly, search })

export const saveContact = (input: { name: string; phoneNumber: string }) =>
  fetchNui('saveContact', input)

export const deleteContact = (id: number) => fetchNui('deleteContact', { id })

export const setFavorite = (id: number, favorite: boolean) =>
  fetchNui('setFavorite', { id, favorite })
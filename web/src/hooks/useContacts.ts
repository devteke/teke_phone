import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '../api/contacts'
import type { Contact } from '../types'

export const CONTACTS_PAGE_SIZE = 15
const LIST_KEY = ['contacts', 'list']
const NAMES_KEY = ['contactNames']

// Sayfali Rehber listesi (next/prev)
export function useContactsPage(page: number) {
  return useQuery({
    queryKey: [...LIST_KEY, page],
    queryFn: () => api.getContacts(page * CONTACTS_PAGE_SIZE, CONTACTS_PAGE_SIZE),
    placeholderData: keepPreviousData, // sayfa gecisinde titremesin
  })
}

// Isim cozumu icin minimal tam liste (mesaj + konusma ekranlari)
export function useContactNames() {
  return useQuery({ queryKey: NAMES_KEY, queryFn: api.getContactNames })
}

export function useSaveContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { name: string; phoneNumber: string }) => api.saveContact(input),
    onSuccess: (_res, input) => {
      // isim haritasini aninda guncelle (DB'siz)
      qc.setQueryData<Contact[]>(NAMES_KEY, (old) => {
        const list = old ? old.slice() : []
        const i = list.findIndex((c) => c.phoneNumber === input.phoneNumber)
        if (i >= 0) list[i] = { ...list[i]!, name: input.name }
        else list.push({ id: 0, name: input.name, phoneNumber: input.phoneNumber })
        return list
      })
      qc.invalidateQueries({ queryKey: LIST_KEY }) // sayfali listeyi tazele
    },
  })
}

export function useDeleteContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (c: { id: number; phoneNumber: string }) => api.deleteContact(c.id),
    onSuccess: (_res, c) => {
      qc.setQueryData<Contact[]>(NAMES_KEY, (old) => old?.filter((x) => x.phoneNumber !== c.phoneNumber))
      qc.invalidateQueries({ queryKey: LIST_KEY })
    },
  })
}
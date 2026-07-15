import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '../api/contacts'

export const CONTACTS_PAGE = 7

export function useContactsPage(favoritesOnly: boolean, search: string, page: number, enabled = true) {
  return useQuery({
    queryKey: ['contacts', favoritesOnly, search, page],
    queryFn: () => api.getContacts(page * CONTACTS_PAGE, CONTACTS_PAGE, favoritesOnly, search),
    placeholderData: keepPreviousData,
    enabled,
  })
}

export function useSaveContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { name: string; phoneNumber: string }) => api.saveContact(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['contacts'] })
      void qc.invalidateQueries({ queryKey: ['conversations'] })
      void qc.invalidateQueries({ queryKey: ['calls'] })
    },
  })
}

export function useDeleteContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (c: { id: number }) => api.deleteContact(c.id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['contacts'] })
      void qc.invalidateQueries({ queryKey: ['conversations'] })
      void qc.invalidateQueries({ queryKey: ['calls'] })
    },
  })
}

export function useSetFavorite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { id: number; favorite: boolean }) => api.setFavorite(input.id, input.favorite),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['contacts'] }),
  })
}
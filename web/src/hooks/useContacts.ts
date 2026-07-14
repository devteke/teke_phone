import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '../api/contacts'
import type { Contact } from '../types'

const KEY = ['contacts']

export function useContacts() {
  return useQuery({ queryKey: KEY, queryFn: api.getContacts })
}

export function useSaveContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { name: string; phoneNumber: string }) => api.saveContact(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useDeleteContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (c: { id: number; phoneNumber: string }) => api.deleteContact(c.id),
    onMutate: async (c) => {
      await qc.cancelQueries({ queryKey: KEY })
      const prev = qc.getQueryData<Contact[]>(KEY)
      qc.setQueryData<Contact[]>(KEY, (old) => old?.filter((x) => x.id !== c.id))
      return { prev }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY, ctx.prev)
    },
  })
}

export function useSetFavorite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { id: number; favorite: boolean }) => api.setFavorite(input.id, input.favorite),
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: KEY })
      const prev = qc.getQueryData<Contact[]>(KEY)
      qc.setQueryData<Contact[]>(KEY, (old) =>
        old?.map((c) => (c.id === input.id ? { ...c, favorite: input.favorite } : c)),
      )
      return { prev }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY, ctx.prev)
    },
  })
}
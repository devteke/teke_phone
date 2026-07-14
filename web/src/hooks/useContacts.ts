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
    onSuccess: (list) => qc.setQueryData<Contact[]>(KEY, list ?? []),
  })
}

export function useDeleteContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.deleteContact(id),
    onSuccess: (list) => qc.setQueryData<Contact[]>(KEY, list ?? []),
  })
}
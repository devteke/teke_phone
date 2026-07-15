import { keepPreviousData, useQuery } from '@tanstack/react-query'
import * as api from '../api/calls'

export const CALLS_PAGE = 10

export function useCallsPage(page: number, enabled = true) {
  return useQuery({
    queryKey: ['calls', page],
    queryFn: () => api.getCalls(page * CALLS_PAGE, CALLS_PAGE),
    placeholderData: keepPreviousData,
    enabled,
  })
}
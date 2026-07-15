import { fetchNui } from '../lib/fetchNui'
import type { Call, PagedList } from '../types'

export const getCalls = (offset: number, limit: number) =>
  fetchNui<PagedList<Call>>('getCalls', { offset, limit })
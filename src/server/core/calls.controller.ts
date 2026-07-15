import { onClientCallback } from '@overextended/ox_lib/server'
import { Events } from '../../shared/events'
import type { Call, PagedList } from '../../shared/types'
import { resolveIdentity } from './identity'
import { callsService } from './calls.service'

export function registerCallCallbacks(): void {
  onClientCallback(
    Events.getCalls,
    async (source: number, payload: { limit?: number; offset?: number }): Promise<PagedList<Call>> => {
      const me = await resolveIdentity(source)
      if (!me) return { items: [], total: 0 }
      const limit = Math.min(Math.max(payload?.limit ?? 7, 1), 50)
      const offset = Math.max(payload?.offset ?? 0, 0)
      return callsService.list(me.phoneNumber, limit, offset)
    },
  )
}
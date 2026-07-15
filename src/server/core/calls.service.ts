import type { Call, CallDirection, CallStatus, PagedList } from '../../shared/types'
import { callsRepo, type CallRow } from '../db/calls.repo'

function toCall(row: CallRow): Call {
  return {
    id: row.id,
    partnerNumber: row.partner_number,
    partnerName: row.partner_name ?? row.partner_number,
    direction: (row.direction === 'outgoing' ? 'outgoing' : 'incoming') as CallDirection,
    status: (['answered', 'missed', 'rejected'].includes(row.status)
      ? row.status
      : 'answered') as CallStatus,
    duration: Number(row.duration) || 0,
    createdAt: row.created_at,
  }
}

export const callsService = {
  async list(myNumber: string, limit: number, offset: number): Promise<PagedList<Call>> {
    const [rows, total] = await Promise.all([
      callsRepo.listPage(myNumber, limit, offset),
      callsRepo.count(myNumber),
    ])
    return { items: rows.map(toCall), total }
  },

  // Faz 2 dialer bunu cagiracak.
  async log(caller: string, callee: string, status: CallStatus, duration: number): Promise<number> {
    return callsRepo.insert(caller, callee, status, duration)
  },
}
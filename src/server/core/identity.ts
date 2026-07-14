import { phoneService } from './phone.service'
import { phoneRepo } from '../db/phone.repo'

const qbx = (globalThis as any).exports.qbx_core

export interface Identity {
  citizenid: string
  phoneNumber: string
  name: string
}

// source -> oyuncu kimligi + telefon numarasi (yoksa uretir)
export async function resolveIdentity(source: number): Promise<Identity | null> {
  const player = qbx.GetPlayer(source)
  if (!player) return null
  const { citizenid, charinfo } = player.PlayerData
  const name = `${charinfo.firstname} ${charinfo.lastname}`
  const { phoneNumber } = await phoneService.getOrCreate(citizenid, name)
  return { citizenid, phoneNumber, name }
}

// Bu numaraya sahip oyuncu cevrimici mi? Kaynagini (source) dondur.
export async function onlineSourceByNumber(phoneNumber: string): Promise<number | null> {
  const row = await phoneRepo.findByNumber(phoneNumber)
  if (!row) return null
  const player = qbx.GetPlayerByCitizenId(row.citizenid)
  return player ? player.PlayerData.source : null
}
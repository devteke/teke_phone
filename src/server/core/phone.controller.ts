import { onClientCallback } from '@overextended/ox_lib/server'
import { Config } from '../../shared/config'
import { Events } from '../../shared/events'
import type { PhoneData } from '../../shared/types'
import { phoneService } from './phone.service'

// FiveM global exports (module.exports ile karışmasın diye global üzerinden)
const exp = (globalThis as any).exports
const qbx = exp.qbx_core

// client -> server veri isteği
export function registerPhoneCallbacks(): void {
  onClientCallback(Events.getPhoneData, async (source: number): Promise<PhoneData | null> => {
    const player = qbx.GetPlayer(source)
    if (!player) return null

    const { citizenid, charinfo } = player.PlayerData
    const ownerName = `${charinfo.firstname} ${charinfo.lastname}`
    return phoneService.getOrCreate(citizenid, ownerName)
  })
}

// ox_inventory usable item.
// items.lua içine: ['phone'] = { label = 'Telefon', weight = 190, export = 'teke_phone.phone' }
export function registerPhoneItem(): void {
  exp(Config.phoneItem, (event: string, _item: unknown, inventory: { id: number }) => {
    if (event !== 'usingItem') return
    emitNet(Events.openPhone, inventory.id)
  })
}
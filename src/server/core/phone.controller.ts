import { onClientCallback } from '@overextended/ox_lib/server'
import { Config } from '../../shared/config'
import { Events } from '../../shared/events'
import type { PhoneData } from '../../shared/types'
import { resolveIdentity } from './identity'

const exp = (globalThis as any).exports

// client -> server veri istegi
export function registerPhoneCallbacks(): void {
  onClientCallback(Events.getPhoneData, async (source: number): Promise<PhoneData | null> => {
    const me = await resolveIdentity(source)
    if (!me) return null
    return { phoneNumber: me.phoneNumber, ownerName: me.name }
  })
}

// ox_inventory usable item
export function registerPhoneItem(): void {
  exp(Config.phoneItem, (event: string, _item: unknown, inventory: { id: number }) => {
    if (event !== 'usingItem') return
    emitNet(Events.openPhone, inventory.id)
  })
}
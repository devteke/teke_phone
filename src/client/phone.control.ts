import { triggerServerCallback } from '@overextended/ox_lib/client'
import { Config } from '../shared/config'
import { Events, NuiAction, NuiCallback } from '../shared/events'
import type { PhoneData } from '../shared/types'
import { isVisible, sendNui, setNuiVisible } from './nui.bridge'

async function openPhone(): Promise<void> {
  if (isVisible()) return

  const data = await triggerServerCallback<PhoneData | null>(Events.getPhoneData, null)
  if (!data) return

  setNuiVisible(true)
  sendNui(NuiAction.setPhoneData, data)
}

function closePhone(): void {
  if (!isVisible()) return
  setNuiVisible(false)
}

export function registerPhoneControls(): void {
  // NUI kapatma isteği (ESC / kapat butonu)
  RegisterNuiCallbackType(NuiCallback.close)
  on(`__cfx_nui:${NuiCallback.close}`, (_data: unknown, cb: (r: unknown) => void) => {
    closePhone()
    cb({ ok: true })
  })

  // Tuş ile aç/kapat (F1)
  RegisterCommand('teke_phone:toggle', () => {
    if (isVisible()) closePhone()
    else void openPhone()
  }, false)
  RegisterKeyMapping('teke_phone:toggle', 'Telefonu aç/kapat', 'keyboard', Config.openKey)

  // Item ile açma (server -> client push)
  onNet(Events.openPhone, () => {
    void openPhone()
  })
}
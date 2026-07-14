import { triggerServerCallback } from '@overextended/ox_lib/client'
import { Events } from '../shared/events'

// NUI'den (fetchNui) gelen istekleri ilgili server callback'ine proxy'ler.
function proxy(nuiName: string, serverEvent: string): void {
  RegisterNuiCallbackType(nuiName)
  on(`__cfx_nui:${nuiName}`, async (data: unknown, cb: (r: unknown) => void) => {
    const result = await triggerServerCallback(serverEvent, null, data)
    cb(result ?? null)
  })
}

export function registerNuiProxies(): void {
  proxy('getContacts', Events.getContacts)
  proxy('saveContact', Events.saveContact)
  proxy('deleteContact', Events.deleteContact)
  proxy('getConversations', Events.getConversations)
  proxy('getMessages', Events.getMessages)
  proxy('sendMessage', Events.sendMessage)
}
import { NuiAction } from '../shared/events'
import type { NuiMessage } from '../shared/types'

let visible = false

// client -> NUI mesaj gönder
export function sendNui<T>(action: string, data?: T): void {
  SendNuiMessage(JSON.stringify({ action, data } satisfies NuiMessage<T>))
}

// odak + görünürlük
export function setNuiVisible(state: boolean): void {
  visible = state
  SetNuiFocus(state, state)
  sendNui(NuiAction.setVisible, state)
}

export function isVisible(): boolean {
  return visible
}
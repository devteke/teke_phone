import { Events, NuiAction } from '../shared/events'
import type { Message } from '../shared/types'
import { sendNui } from './nui.bridge'

// Sunucudan gelen push'lari NUI'ye aktarir.
export function registerServerPushes(): void {
  onNet(Events.newMessage, (message: Message) => {
    sendNui(NuiAction.newMessage, message)
  })
}
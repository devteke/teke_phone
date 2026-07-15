import { Config } from '../shared/config'
import { registerPhoneCallbacks, registerPhoneItem } from './core/phone.controller'
import { registerContactCallbacks } from './core/contacts.controller'
import { registerCallCallbacks } from './core/calls.controller'
import { registerMessageCallbacks } from './core/messages.controller'
import { registerDevCommands } from './core/dev.controller'

registerPhoneCallbacks()
registerPhoneItem()
registerContactCallbacks()
registerCallCallbacks()
registerMessageCallbacks()

if (Config.dev) registerDevCommands() // sadece gelistirme

console.log('[teke_phone] sunucu basladi')
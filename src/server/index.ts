import { registerPhoneCallbacks, registerPhoneItem } from './core/phone.controller'
import { registerContactCallbacks } from './core/contacts.controller'
import { registerMessageCallbacks } from './core/messages.controller'

registerPhoneCallbacks()
registerPhoneItem()
registerContactCallbacks()
registerMessageCallbacks()

console.log('[teke_phone] sunucu basladi')
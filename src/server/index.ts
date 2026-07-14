import { registerPhoneCallbacks, registerPhoneItem } from './core/phone.controller'

// Kaynak açılışında controller'ları bağla
registerPhoneCallbacks()
registerPhoneItem()

console.log('[teke_phone] sunucu başladı')
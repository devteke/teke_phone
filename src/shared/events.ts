// Tüm net event / callback / NUI isimleri tek yerde (çakışmayı önler)
export const Events = {
  getPhoneData: 'teke_phone:getPhoneData', // client -> server (ox_lib onClientCallback / triggerServerCallback)
  openPhone: 'teke_phone:client:open',     // server -> client (push, item kullanımı)
} as const

// client -> NUI mesaj tipleri
export const NuiAction = {
  setVisible: 'setVisible',
  setPhoneData: 'setPhoneData',
} as const

// NUI -> client callback isimleri
export const NuiCallback = {
  close: 'close',
} as const
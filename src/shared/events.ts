// Tum net event / callback / NUI isimleri tek yerde (cakismayi onler)
export const Events = {
  getPhoneData: 'teke_phone:getPhoneData',
  getContacts: 'teke_phone:getContacts',
  saveContact: 'teke_phone:saveContact',
  deleteContact: 'teke_phone:deleteContact',
  setFavorite: 'teke_phone:setFavorite',
  getConversations: 'teke_phone:getConversations',
  getMessages: 'teke_phone:getMessages',
  sendMessage: 'teke_phone:sendMessage',
  openPhone: 'teke_phone:client:open',
  newMessage: 'teke_phone:client:newMessage',
} as const

// client -> NUI mesaj tipleri
export const NuiAction = {
  setVisible: 'setVisible',
  setPhoneData: 'setPhoneData',
  newMessage: 'newMessage',
} as const

// NUI -> client callback isimleri
export const NuiCallback = {
  close: 'close',
} as const
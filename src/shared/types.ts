export interface Page<T> {
  items: T[]
  nextCursor: number | null // daha eski sayfa icin id; yoksa null
}
export interface PagedList<T> {
  items: T[]
  total: number // numarali sayfalama icin toplam kayit
}

export interface PhoneData {
  phoneNumber: string
  ownerName: string
}

export interface NuiMessage<T = unknown> {
  action: string
  data?: T
}

export interface Contact {
  id: number
  name: string
  phoneNumber: string
  favorite: boolean
}

export interface Conversation {
  phoneNumber: string   // karsi taraf
  displayName: string   // rehberdeki isim ya da numara (sunucuda JOIN ile)
  lastMessage: string
  lastTime: string
  unread: number
}

export interface Message {
  id: number
  senderNumber: string
  receiverNumber: string
  content: string
  createdAt: string
  isMine: boolean       // goruntuleyen icin: ben mi gonderdim
}

// Thread = mesaj sayfasi + karsi tarafin cozulmus ismi (baslik icin)
export interface Thread extends Page<Message> {
  partnerName: string
}

export type CallDirection = 'incoming' | 'outgoing'
export type CallStatus = 'answered' | 'missed' | 'rejected'

export interface Call {
  id: number
  partnerNumber: string   // karsi taraf
  partnerName: string     // rehber ismi ya da numara
  direction: CallDirection
  status: CallStatus
  duration: number        // saniye
  createdAt: string
}
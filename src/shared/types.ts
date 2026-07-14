export interface Page<T> {
  items: T[]
  nextCursor: number | null // daha eski sayfa icin id; yoksa null
}
export interface PagedList<T> {
  items: T[]
  total: number
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
  displayName: string   // rehberdeki isim ya da numara
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
export interface Page<T> {
  items: T[]
  nextCursor: number | null
}
export interface PagedList<T> {
  items: T[]
  total: number
}
export interface Contact {
  id: number
  name: string
  phoneNumber: string
  favorite: boolean
}

export interface Conversation {
  phoneNumber: string
  displayName: string
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
  isMine: boolean
}
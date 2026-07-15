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
export interface Thread extends Page<Message> {
  partnerName: string
}
export type CallDirection = 'incoming' | 'outgoing'
export type CallStatus = 'answered' | 'missed' | 'rejected'
export interface Call {
  id: number
  partnerNumber: string
  partnerName: string
  direction: CallDirection
  status: CallStatus
  duration: number
  createdAt: string
}
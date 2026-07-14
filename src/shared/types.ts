export interface PhoneData {
  phoneNumber: string
  ownerName: string
}

export interface NuiMessage<T = unknown> {
  action: string
  data?: T
}
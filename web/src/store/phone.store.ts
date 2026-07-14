import { create } from 'zustand'

export interface PhoneData {
  phoneNumber: string
  ownerName: string
}

interface PhoneState {
  visible: boolean
  phone: PhoneData | null
  setVisible: (v: boolean) => void
  setPhone: (p: PhoneData) => void
}

export const usePhoneStore = create<PhoneState>((set) => ({
  visible: false,
  phone: null,
  setVisible: (visible) => set({ visible }),
  setPhone: (phone) => set({ phone }),
}))
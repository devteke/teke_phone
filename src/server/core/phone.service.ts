import { Config } from '../../shared/config'
import type { PhoneData } from '../../shared/types'
import { phoneRepo } from '../db/phone.repo'

function randomNumber(): string {
  let digits = ''
  for (let i = 0; i < Config.numberLength; i++) {
    digits += Math.floor(Math.random() * 10).toString()
  }
  return `${Config.numberPrefix}${digits}`
}

async function generateUniqueNumber(): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = randomNumber()
    if (!(await phoneRepo.numberExists(candidate))) return candidate
  }
  throw new Error('teke_phone: benzersiz numara üretilemedi')
}

export const phoneService = {
  // Oyuncunun telefonunu getir; yoksa oluştur.
  async getOrCreate(citizenid: string, ownerName: string): Promise<PhoneData> {
    let row = await phoneRepo.findByCitizenId(citizenid)
    if (!row) {
      const phoneNumber = await generateUniqueNumber()
      await phoneRepo.insert(citizenid, phoneNumber)
      row = { citizenid, phone_number: phoneNumber }
    }
    return { phoneNumber: row.phone_number, ownerName }
  },
}
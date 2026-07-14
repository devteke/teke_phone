// Yalnızca DB erişimi — iş kuralı yok.
const oxmysql = (globalThis as any).exports.oxmysql

export interface PhoneRow {
  citizenid: string
  phone_number: string
}

export const phoneRepo = {
  async findByCitizenId(citizenid: string): Promise<PhoneRow | null> {
    const row = await oxmysql.single_async(
      'SELECT citizenid, phone_number FROM teke_phones WHERE citizenid = ?',
      [citizenid],
    )
    return row ?? null
  },

  async numberExists(phoneNumber: string): Promise<boolean> {
    const found = await oxmysql.scalar_async(
      'SELECT 1 FROM teke_phones WHERE phone_number = ?',
      [phoneNumber],
    )
    return Boolean(found)
  },

  async insert(citizenid: string, phoneNumber: string): Promise<void> {
    await oxmysql.insert_async(
      'INSERT INTO teke_phones (citizenid, phone_number) VALUES (?, ?)',
      [citizenid, phoneNumber],
    )
  },
}
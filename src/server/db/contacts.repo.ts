// Yalnizca DB erisimi.
const oxmysql = (globalThis as any).exports.oxmysql

export interface ContactRow {
  id: number
  name: string
  phone_number: string
}

export const contactsRepo = {
  async list(ownerNumber: string): Promise<ContactRow[]> {
    return (await oxmysql.query_async(
      'SELECT id, name, phone_number FROM teke_phone_contacts WHERE owner_number = ? ORDER BY name ASC',
      [ownerNumber],
    )) ?? []
  },

  async insert(ownerNumber: string, name: string, phoneNumber: string): Promise<number> {
    return oxmysql.insert_async(
      'INSERT INTO teke_phone_contacts (owner_number, name, phone_number) VALUES (?, ?, ?)',
      [ownerNumber, name, phoneNumber],
    )
  },

  async remove(ownerNumber: string, id: number): Promise<void> {
    await oxmysql.update_async(
      'DELETE FROM teke_phone_contacts WHERE id = ? AND owner_number = ?',
      [id, ownerNumber],
    )
  },
}
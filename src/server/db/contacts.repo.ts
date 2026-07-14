const oxmysql = (globalThis as any).exports.oxmysql

export interface ContactRow {
  id: number
  name: string
  phone_number: string
  is_favorite: number
}

export const contactsRepo = {
  async list(ownerNumber: string): Promise<ContactRow[]> {
    return (await oxmysql.query_async(
      'SELECT id, name, phone_number, is_favorite FROM teke_phone_contacts WHERE owner_number = ? ORDER BY name ASC',
      [ownerNumber],
    )) ?? []
  },

  async insert(ownerNumber: string, name: string, phoneNumber: string): Promise<number> {
    return oxmysql.insert_async(
      `INSERT INTO teke_phone_contacts (owner_number, name, phone_number)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      [ownerNumber, name, phoneNumber],
    )
  },

  async remove(ownerNumber: string, id: number): Promise<void> {
    await oxmysql.update_async(
      'DELETE FROM teke_phone_contacts WHERE id = ? AND owner_number = ?',
      [id, ownerNumber],
    )
  },

  async setFavorite(ownerNumber: string, id: number, favorite: boolean): Promise<void> {
    await oxmysql.update_async(
      'UPDATE teke_phone_contacts SET is_favorite = ? WHERE id = ? AND owner_number = ?',
      [favorite ? 1 : 0, id, ownerNumber],
    )
  },
}
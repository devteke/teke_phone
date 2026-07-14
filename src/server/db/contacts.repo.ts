const oxmysql = (globalThis as any).exports.oxmysql

export interface ContactRow {
  id: number
  name: string
  phone_number: string
}

export const contactsRepo = {
  async page(ownerNumber: string, limit: number, offset: number): Promise<ContactRow[]> {
    return (await oxmysql.query_async(
      'SELECT id, name, phone_number FROM teke_phone_contacts WHERE owner_number = ? ORDER BY name ASC LIMIT ? OFFSET ?',
      [ownerNumber, limit, offset],
    )) ?? []
  },

  async count(ownerNumber: string): Promise<number> {
    const n = await oxmysql.scalar_async(
      'SELECT COUNT(*) FROM teke_phone_contacts WHERE owner_number = ?',
      [ownerNumber],
    )
    return Number(n) || 0
  },

  // Isim cozumu icin minimal tam liste (numara -> isim).
  async names(ownerNumber: string): Promise<Array<{ name: string; phone_number: string }>> {
    return (await oxmysql.query_async(
      'SELECT name, phone_number FROM teke_phone_contacts WHERE owner_number = ?',
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
}
const oxmysql = (globalThis as any).exports.oxmysql

export interface ContactRow {
  id: number
  name: string
  phone_number: string
  is_favorite: number
}

export const contactsRepo = {
  async listPage(
    ownerNumber: string,
    favoritesOnly: boolean,
    search: string,
    limit: number,
    offset: number,
  ): Promise<ContactRow[]> {
    const favClause = favoritesOnly ? 'AND is_favorite = 1' : ''
    const searchClause = search ? 'AND (name LIKE ? OR phone_number LIKE ?)' : ''
    const params: Array<string | number> = [ownerNumber]
    if (search) {
      const like = `%${search}%`
      params.push(like, like)
    }
    params.push(limit, offset)
    return (await oxmysql.query_async(
      `SELECT id, name, phone_number, is_favorite
       FROM teke_phone_contacts
       WHERE owner_number = ? ${favClause} ${searchClause}
       ORDER BY name ASC
       LIMIT ? OFFSET ?`,
      params,
    )) ?? []
  },

  async count(ownerNumber: string, favoritesOnly: boolean, search: string): Promise<number> {
    const favClause = favoritesOnly ? 'AND is_favorite = 1' : ''
    const searchClause = search ? 'AND (name LIKE ? OR phone_number LIKE ?)' : ''
    const params: Array<string | number> = [ownerNumber]
    if (search) {
      const like = `%${search}%`
      params.push(like, like)
    }
    return (
      (await oxmysql.scalar_async(
        `SELECT COUNT(*) FROM teke_phone_contacts WHERE owner_number = ? ${favClause} ${searchClause}`,
        params,
      )) ?? 0
    )
  },

  async nameOf(ownerNumber: string, phoneNumber: string): Promise<string | null> {
    return (
      (await oxmysql.scalar_async(
        'SELECT name FROM teke_phone_contacts WHERE owner_number = ? AND phone_number = ? LIMIT 1',
        [ownerNumber, phoneNumber],
      )) ?? null
    )
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
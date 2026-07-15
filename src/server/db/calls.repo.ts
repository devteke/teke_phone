const oxmysql = (globalThis as any).exports.oxmysql

export interface CallRow {
  id: number
  partner_number: string
  partner_name: string | null
  direction: string // 'incoming' | 'outgoing' (SQL'de hesaplanir)
  status: string
  duration: number
  created_at: string
}

export const callsRepo = {
  // Beni ilgilendiren cagrilar, en yeniden eskiye, sayfali. Isim JOIN ile.
  async listPage(myNumber: string, limit: number, offset: number): Promise<CallRow[]> {
    return (await oxmysql.query_async(
      `SELECT
         c.id,
         CASE WHEN c.caller_number = ? THEN c.callee_number ELSE c.caller_number END AS partner_number,
         (SELECT k.name FROM teke_phone_contacts k
            WHERE k.owner_number = ?
              AND k.phone_number = CASE WHEN c.caller_number = ? THEN c.callee_number ELSE c.caller_number END
            LIMIT 1) AS partner_name,
         CASE WHEN c.caller_number = ? THEN 'outgoing' ELSE 'incoming' END AS direction,
         c.status, c.duration, c.created_at
       FROM teke_phone_calls c
       WHERE c.caller_number = ? OR c.callee_number = ?
       ORDER BY c.created_at DESC, c.id DESC
       LIMIT ? OFFSET ?`,
      [myNumber, myNumber, myNumber, myNumber, myNumber, myNumber, limit, offset],
    )) ?? []
  },

  async count(myNumber: string): Promise<number> {
    return (
      (await oxmysql.scalar_async(
        'SELECT COUNT(*) FROM teke_phone_calls WHERE caller_number = ? OR callee_number = ?',
        [myNumber, myNumber],
      )) ?? 0
    )
  },

  // Faz 2 dialer bunu kullanacak; simdilik dev-seed cagiriyor.
  async insert(
    caller: string,
    callee: string,
    status: string,
    duration: number,
  ): Promise<number> {
    return oxmysql.insert_async(
      'INSERT INTO teke_phone_calls (caller_number, callee_number, status, duration) VALUES (?, ?, ?, ?)',
      [caller, callee, status, duration],
    )
  },
}
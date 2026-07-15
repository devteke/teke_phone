const oxmysql = (globalThis as any).exports.oxmysql

export interface MessageRow {
  id: number
  sender_number: string
  receiver_number: string
  content: string
  created_at: string
}

export interface ConversationRow {
  partner_number: string
  partner_name: string | null
  last_message: string
  last_time: string
  unread: number
}

export const messagesRepo = {
  // Her partner icin son mesaj + okunmamis sayisi + rehber ismi (JOIN).
  async conversations(myNumber: string, limit: number, offset: number): Promise<ConversationRow[]> {
    return (await oxmysql.query_async(
      `SELECT
       t.partner_number,
       (SELECT k.name FROM teke_phone_contacts k
          WHERE k.owner_number = ? AND k.phone_number = t.partner_number LIMIT 1) AS partner_name,
       (SELECT content FROM teke_phone_messages m
        WHERE (m.sender_number = ? AND m.receiver_number = t.partner_number)
           OR (m.sender_number = t.partner_number AND m.receiver_number = ?)
        ORDER BY m.created_at DESC LIMIT 1) AS last_message,
       MAX(t.created_at) AS last_time,
       SUM(CASE WHEN t.receiver_number = ? AND t.is_read = 0 THEN 1 ELSE 0 END) AS unread
     FROM (
       SELECT
         CASE WHEN sender_number = ? THEN receiver_number ELSE sender_number END AS partner_number,
         created_at, receiver_number, is_read
       FROM teke_phone_messages
       WHERE sender_number = ? OR receiver_number = ?
     ) t
     GROUP BY t.partner_number
     ORDER BY last_time DESC
     LIMIT ? OFFSET ?`,
      [myNumber, myNumber, myNumber, myNumber, myNumber, myNumber, myNumber, limit, offset],
    )) ?? []
  },

  // Bir sohbetin mesajlari (cursor: beforeId'den ESKI olanlar, en yeniden geriye).
  async thread(
    myNumber: string,
    partnerNumber: string,
    beforeId: number,
    limit: number,
  ): Promise<MessageRow[]> {
    return (await oxmysql.query_async(
      `SELECT id, sender_number, receiver_number, content, created_at
     FROM teke_phone_messages
     WHERE ((sender_number = ? AND receiver_number = ?)
         OR (sender_number = ? AND receiver_number = ?))
       AND (? = 0 OR id < ?)
     ORDER BY id DESC
     LIMIT ?`,
      [myNumber, partnerNumber, partnerNumber, myNumber, beforeId, beforeId, limit],
    )) ?? []
  },

  async markRead(myNumber: string, partnerNumber: string): Promise<void> {
    await oxmysql.update_async(
      `UPDATE teke_phone_messages SET is_read = 1
       WHERE receiver_number = ? AND sender_number = ? AND is_read = 0`,
      [myNumber, partnerNumber],
    )
  },

  async insert(fromNumber: string, toNumber: string, content: string): Promise<number> {
    return oxmysql.insert_async(
      'INSERT INTO teke_phone_messages (sender_number, receiver_number, content) VALUES (?, ?, ?)',
      [fromNumber, toNumber, content],
    )
  },
}
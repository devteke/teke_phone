export const Config = {
  // Telefonu açan item (ox_inventory usable item adı)
  phoneItem: 'phone',
  // Aç/kapat kısayolu (RegisterKeyMapping varsayılanı)
  openKey: 'F1',
  // Numara formatı: 555XXXXXXX
  numberPrefix: '555',
  numberLength: 7,
} as const

export type ConfigType = typeof Config
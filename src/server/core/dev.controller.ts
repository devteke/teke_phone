import { Events } from '../../shared/events'
import { resolveIdentity } from './identity'
import { messagesRepo } from '../db/messages.repo'
import { contactsRepo } from '../db/contacts.repo'
import { callsService } from './calls.service'

// Tek kisilik test icin sahte veri + gelen mesaj simulasyonu.
// Sadece Config.dev = true iken index.ts kaydeder.
export function registerDevCommands(): void {
  // Kendine sahte kisi + gelen konusma olustur (CANLI push)
  RegisterCommand(
    'teke_devseed',
    async (source: number) => {
      const me = await resolveIdentity(source)
      if (!me) return
      const fake = '5551112233'
      const content = 'Selam! Bu bir test mesaji.'
      await contactsRepo.insert(me.phoneNumber, 'Test Kisi', fake) // artik cogaltmaz
      const id = await messagesRepo.insert(fake, me.phoneNumber, content)
      emitNet(Events.newMessage, source, {
        id,
        senderNumber: fake,
        receiverNumber: me.phoneNumber,
        content,
        createdAt: new Date().toISOString(),
        isMine: false,
      })
      console.log(`[teke_phone][dev] ${me.phoneNumber} icin sahte veri eklendi`)
    },
    false,
  )

  // Bir numaradan sana geliyormus gibi CANLI mesaj (DB + push)
  RegisterCommand(
    'teke_devmsg',
    async (source: number, args: string[]) => {
      const me = await resolveIdentity(source)
      if (!me) return
      const from = args[0] ?? '5559998877'
      const content = args.slice(1).join(' ') || 'Test mesaji'
      const id = await messagesRepo.insert(from, me.phoneNumber, content)
      emitNet(Events.newMessage, source, {
        id,
        senderNumber: from,
        receiverNumber: me.phoneNumber,
        content,
        createdAt: new Date().toISOString(),
        isMine: false,
      })
      console.log(`[teke_phone][dev] ${from} -> ${me.phoneNumber}: ${content}`)
    },
    false,
  )

  // Sahte cagri kayitlari (giden / gelen / cevapsiz) - Son Aramalar sekmesini test icin
  RegisterCommand(
    'teke_devcall',
    async (source: number) => {
      const me = await resolveIdentity(source)
      if (!me) return
      const partner = '5551112233'
      await contactsRepo.insert(me.phoneNumber, 'Test Kisi', partner)
      await callsService.log(me.phoneNumber, partner, 'answered', 42) // giden, 42 sn
      await callsService.log(partner, me.phoneNumber, 'answered', 15) // gelen, 15 sn
      await callsService.log(partner, me.phoneNumber, 'missed', 0)    // cevapsiz
      console.log(`[teke_phone][dev] ${me.phoneNumber} icin sahte cagrilar eklendi`)
    },
    false,
  )
}
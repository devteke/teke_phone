import { usePhoneStore } from '../store/phone.store'

export function HomeScreen() {
  const phone = usePhoneStore((s) => s.phone)

  return (
    <div className="home">
      <header className="home__status">
        <span>{phone?.phoneNumber ?? '---'}</span>
      </header>
      <main className="home__apps">
        <p className="home__welcome">
          {phone ? `Merhaba, ${phone.ownerName}` : 'Yükleniyor...'}
        </p>
        {/* Faz 1+: uygulama ikonları buraya */}
      </main>
    </div>
  )
}
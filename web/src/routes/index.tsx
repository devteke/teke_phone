import { Link } from '@tanstack/react-router'
import { usePhoneStore } from '../store/phone.store'

const APPS = [
  { to: '/messages', label: 'Mesajlar', icon: '💬' },
  { to: '/contacts', label: 'Rehber', icon: '👤' },
] as const

export function HomeScreen() {
  const phone = usePhoneStore((s) => s.phone)

  return (
    <div className="home">
      <header className="home__status">
        <span>{phone?.phoneNumber ?? '---'}</span>
      </header>
      <div className="home__grid">
        {APPS.map((app) => (
          <Link key={app.to} to={app.to} className="app">
            <span className="app__icon">{app.icon}</span>
            <span className="app__label">{app.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
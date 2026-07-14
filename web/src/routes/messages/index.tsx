import { Link } from '@tanstack/react-router'
import { AppHeader } from '../../components/AppHeader'
import { useResolveName } from '../../hooks/useContactName'
import { useConversations } from '../../hooks/useMessages'

export function MessagesScreen() {
  const { data: conversations = [], isLoading } = useConversations()
  const resolveName = useResolveName()

  return (
    <div className="screen">
      <AppHeader title="Mesajlar" />
      <div className="list">
        {isLoading && <p className="muted">Yukleniyor...</p>}
        {!isLoading && conversations.length === 0 && <p className="muted">Henuz mesaj yok</p>}
        {conversations.map((c) => (
          <Link
            key={c.phoneNumber}
            to="/messages/$partner"
            params={{ partner: c.phoneNumber }}
            className="row"
          >
            <div className="row__main">
              <span className="row__title">{resolveName(c.phoneNumber)}</span>
              <span className="row__sub">{c.lastMessage}</span>
            </div>
            {c.unread > 0 && <span className="badge">{c.unread}</span>}
          </Link>
        ))}
      </div>
    </div>
  )
}
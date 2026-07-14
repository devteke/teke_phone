import { useMemo, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { AppHeader } from '../../components/AppHeader'
import { useResolveName } from '../../hooks/useContactName'
import { useConversations } from '../../hooks/useMessages'
import type { Conversation } from '../../types'

export function MessagesScreen() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useConversations()
  const resolveName = useResolveName()
  const scrollRef = useRef<HTMLDivElement>(null)

  // sayfalari duzlestir + numaraya gore tekille (offset kaymasina karsi)
  const conversations = useMemo(() => {
    const seen = new Set<string>()
    const out: Conversation[] = []
    for (const pg of data?.pages ?? []) {
      for (const c of pg.items) {
        if (seen.has(c.phoneNumber)) continue
        seen.add(c.phoneNumber)
        out.push(c)
      }
    }
    return out
  }, [data])

  const onScroll = () => {
    const el = scrollRef.current
    if (!el || isFetchingNextPage || !hasNextPage) return
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 60) void fetchNextPage()
  }

  return (
    <div className="screen">
      <AppHeader title="Mesajlar" />
      <div className="list" ref={scrollRef} onScroll={onScroll}>
        {isLoading && <p className="muted">Yukleniyor...</p>}
        {!isLoading && conversations.length === 0 && <p className="muted">Henuz mesaj yok</p>}
        {conversations.map((c) => (
          <Link key={c.phoneNumber} to="/messages/$partner" params={{ partner: c.phoneNumber }} className="row">
            <div className="row__main">
              <span className="row__title">{resolveName(c.phoneNumber)}</span>
              <span className="row__sub">{c.lastMessage}</span>
            </div>
            {c.unread > 0 && <span className="badge">{c.unread}</span>}
          </Link>
        ))}
        {isFetchingNextPage && <p className="muted">Yukleniyor...</p>}
      </div>
    </div>
  )
}
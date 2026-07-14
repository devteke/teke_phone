import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AppHeader } from '../../components/AppHeader'
import { useResolveName } from '../../hooks/useContactName'
import { useConversations } from '../../hooks/useMessages'
import type { Conversation } from '../../types'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '#'
  const a = parts[0]![0] ?? ''
  const b = parts.length > 1 ? (parts[parts.length - 1]![0] ?? '') : ''
  return (a + b).toLocaleUpperCase('tr-TR')
}
function avatarStyle(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360
  return { background: `linear-gradient(160deg, hsl(${h} 65% 52%), hsl(${(h + 40) % 360} 65% 42%))` }
}

export function MessagesScreen() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useConversations()
  const resolveName = useResolveName()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [q, setQ] = useState('')
  const query = q.trim().toLocaleLowerCase('tr-TR')

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

  // Arama aktifken tum sayfalari cek ki sonuc eksiksiz olsun
  useEffect(() => {
    if (query && hasNextPage && !isFetchingNextPage) void fetchNextPage()
  }, [query, hasNextPage, isFetchingNextPage, fetchNextPage])

  const filtered = useMemo(() => {
    if (!query) return conversations
    return conversations.filter((c) => {
      const name = resolveName(c.phoneNumber).toLocaleLowerCase('tr-TR')
      return (
        name.includes(query) ||
        c.phoneNumber.toLowerCase().includes(query) ||
        c.lastMessage.toLocaleLowerCase('tr-TR').includes(query)
      )
    })
  }, [conversations, query, resolveName])

  const onScroll = () => {
    if (query) return // arama modunda otomatik yukluyoruz
    const el = scrollRef.current
    if (!el || isFetchingNextPage || !hasNextPage) return
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 60) void fetchNextPage()
  }

  return (
    <div className="screen">
      <AppHeader title="Mesajlar" />

      <div className="search">
        <span className="search__icon">🔍</span>
        <input className="search__input" placeholder="Ara" value={q} onChange={(e) => setQ(e.target.value)} />
        {q && <button className="search__clear" onClick={() => setQ('')}>✕</button>}
      </div>

      <div className="list" ref={scrollRef} onScroll={onScroll}>
        {isLoading && <p className="muted">Yukleniyor...</p>}
        {!isLoading && filtered.length === 0 && (
          <p className="muted">{query ? 'Sonuc yok' : 'Henuz mesaj yok'}</p>
        )}
        {filtered.map((c) => {
          const name = resolveName(c.phoneNumber)
          return (
            <Link key={c.phoneNumber} to="/messages/$partner" params={{ partner: c.phoneNumber }} className="row">
              <div className="avatar" style={avatarStyle(name)}>{initials(name)}</div>
              <div className="row__main">
                <span className="row__title">{name}</span>
                <span className="row__sub">{c.lastMessage}</span>
              </div>
              {c.unread > 0 && <span className="badge">{c.unread}</span>}
            </Link>
          )
        })}
        {!query && isFetchingNextPage && <p className="muted">Yukleniyor...</p>}
      </div>
    </div>
  )
}
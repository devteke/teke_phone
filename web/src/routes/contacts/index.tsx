import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AppHeader } from '../../components/AppHeader'
import { useContacts, useDeleteContact, useSetFavorite } from '../../hooks/useContacts'
import { useConversations } from '../../hooks/useMessages'
import { useResolveName } from '../../hooks/useContactName'
import type { Contact } from '../../types'

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
function sectionLetter(name: string): string {
  const ch = name.trim()[0]
  if (!ch) return '#'
  const up = ch.toLocaleUpperCase('tr-TR')
  return /^[0-9]/.test(up) ? '#' : up
}

export function ContactsScreen() {
  const { data: contacts = [], isLoading } = useContacts()
  const { data: convData } = useConversations()
  const resolveName = useResolveName()
  const del = useDeleteContact()
  const fav = useSetFavorite()
  const [q, setQ] = useState('')
  const query = q.trim().toLocaleLowerCase('tr-TR')
  const searching = query.length > 0

  const filtered = useMemo(() => {
    if (!searching) return contacts
    return contacts.filter(
      (c) =>
        c.name.toLocaleLowerCase('tr-TR').includes(query) ||
        c.phoneNumber.toLowerCase().includes(query),
    )
  }, [contacts, query, searching])

  const favorites = useMemo(() => contacts.filter((c) => c.favorite), [contacts])

  const recent = useMemo(() => {
    const partners = (convData?.pages ?? []).flatMap((p) => p.items).slice(0, 6)
    return partners.map((c) => ({ phoneNumber: c.phoneNumber, name: resolveName(c.phoneNumber) }))
  }, [convData, resolveName])

  const sections = useMemo(() => {
    const map = new Map<string, Contact[]>()
    for (const c of filtered) {
      const L = sectionLetter(c.name)
      const arr = map.get(L) ?? []
      arr.push(c)
      map.set(L, arr)
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0], 'tr'))
  }, [filtered])

  const renderContact = (c: Contact) => (
    <div key={c.id} className="row">
      <div className="avatar" style={avatarStyle(c.name)}>{initials(c.name)}</div>
      <div className="row__main">
        <span className="row__title">{c.name}</span>
        <span className="row__sub">{c.phoneNumber}</span>
      </div>
      <div className="row__actions">
        <button
          className={`iconbtn star ${c.favorite ? 'is-active' : ''}`}
          onClick={() => fav.mutate({ id: c.id, favorite: !c.favorite })}
          title="Favori"
        >
          {c.favorite ? '★' : '☆'}
        </button>
        <Link to="/messages/$partner" params= {{partner: c.phoneNumber}}  className="iconbtn" title="Mesaj">
          💬
        </Link>
        <button
          className="iconbtn danger"
          onClick={() => del.mutate({ id: c.id, phoneNumber: c.phoneNumber })}
          title="Sil"
        >
          🗑
        </button>
      </div>
    </div>
  )

  return (
    <div className="screen">
      <AppHeader title="Rehber" action={<Link to="/contacts/new" className="appbar__add">＋</Link>} />

      <div className="search">
        <span className="search__icon">🔍</span>
        <input className="search__input" placeholder="Ara" value={q} onChange={(e) => setQ(e.target.value)} />
        {q && <button className="search__clear" onClick={() => setQ('')}>✕</button>}
      </div>

      <div className="list">
        {isLoading && <p className="muted">Yukleniyor...</p>}
        {!isLoading && contacts.length === 0 && <p className="muted">Kayitli kisi yok</p>}

        {searching ? (
          filtered.length === 0 ? (
            <p className="muted">Sonuc yok</p>
          ) : (
            filtered.map(renderContact)
          )
        ) : (
          !isLoading &&
          contacts.length > 0 && (
            <>
              {favorites.length > 0 && (
                <section className="cgroup">
                  <h2 className="cgroup__title">★ Favoriler</h2>
                  {favorites.map(renderContact)}
                </section>
              )}

              {recent.length > 0 && (
                <section className="cgroup">
                  <h2 className="cgroup__title">Son Konusulanlar</h2>
                  {recent.map((r) => (
                    <Link key={r.phoneNumber} to="/messages/$partner" params= {{partner: r.phoneNumber}}  className="row">
                      <div className="avatar" style={avatarStyle(r.name)}>{initials(r.name)}</div>
                      <div className="row__main">
                        <span className="row__title">{r.name}</span>
                        <span className="row__sub">{r.phoneNumber}</span>
                      </div>
                      <span className="row__go">›</span>
                    </Link>
                  ))}
                </section>
              )}

              {sections.map(([letter, items]) => (
                <section key={letter} className="cgroup">
                  <h2 className="cgroup__title">{letter}</h2>
                  {items.map(renderContact)}
                </section>
              ))}
            </>
          )
        )}
      </div>
    </div>
  )
}
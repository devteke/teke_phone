import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AppHeader } from '../../components/AppHeader'
import { CONTACTS_PAGE, useContactsPage, useDeleteContact, useSetFavorite } from '../../hooks/useContacts'
import { CALLS_PAGE, useCallsPage } from '../../hooks/useCalls'
import type { Call, Contact } from '../../types'

type Tab = 'favorites' | 'recents' | 'all'

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
function fmtDur(s: number): string {
  const m = Math.floor(s / 60)
  const ss = s % 60
  return `${m}:${String(ss).padStart(2, '0')}`
}
function fmtCallTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}
function callLabel(c: Call): string {
  if (c.status === 'missed') return '✖ Cevapsız'
  const dir = c.direction === 'outgoing' ? '↗ Giden' : '↙ Gelen'
  return c.duration > 0 ? `${dir} · ${fmtDur(c.duration)}` : dir
}

function Pager(props: { page: number; total: number; pageSize: number; onPage: (p: number) => void }) {
  const { page, total, pageSize, onPage } = props
  if (total <= pageSize) return null
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  return (
    <div className="pager">
      <button className="pager__btn" disabled={page <= 0} onClick={() => onPage(page - 1)}>‹ Geri</button>
      <span className="pager__info">Sayfa {page + 1} / {pageCount}</span>
      <button className="pager__btn" disabled={page + 1 >= pageCount} onClick={() => onPage(page + 1)}>İleri ›</button>
    </div>
  )
}

export function ContactsScreen() {
  const [tab, setTab] = useState<Tab>('all')
  const [q, setQ] = useState('')
  const search = q.trim()
  const [favPage, setFavPage] = useState(0)
  const [allPage, setAllPage] = useState(0)
  const [callPage, setCallPage] = useState(0)

  const favQ = useContactsPage(true, search, favPage, tab === 'favorites')
  const allQ = useContactsPage(false, search, allPage, tab === 'all')
  const callQ = useCallsPage(callPage, tab === 'recents')

  const del = useDeleteContact()
  const fav = useSetFavorite()

  const onSearch = (v: string) => {
    setQ(v)
    setFavPage(0)
    setAllPage(0)
  }

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
        <Link to="/messages/$partner" params={{ partner: c.phoneNumber }} className="iconbtn" title="Mesaj">💬</Link>
        <button className="iconbtn danger" onClick={() => del.mutate({ id: c.id })} title="Sil">🗑</button>
      </div>
    </div >
  )

  return (
    <div className="screen">
      <AppHeader title="Rehber" action={<Link to="/contacts/new" className="appbar__add">＋</Link>} />

      <div className="tabs">
        <button className={`tab ${tab === 'favorites' ? 'is-active' : ''}`} onClick={() => setTab('favorites')}>Favoriler</button>
        <button className={`tab ${tab === 'recents' ? 'is-active' : ''}`} onClick={() => setTab('recents')}>Son Aramalar</button>
        <button className={`tab ${tab === 'all' ? 'is-active' : ''}`} onClick={() => setTab('all')}>Kişiler</button>
      </div>

      {tab !== 'recents' && (
        <div className="search">
          <span className="search__icon">🔍</span>
          <input className="search__input" placeholder="Ara" value={q} onChange={(e) => onSearch(e.target.value)} />
          {q && <button className="search__clear" onClick={() => onSearch('')}>✕</button>}
        </div>
      )}

      {tab === 'favorites' && (
        <>
          <div className="list">
            {favQ.isLoading && <p className="muted">Yukleniyor...</p>}
            {!favQ.isLoading && (favQ.data?.items.length ?? 0) === 0 && (
              <p className="muted">{search ? 'Sonuc yok' : 'Favori kisi yok'}</p>
            )}
            {favQ.data?.items.map(renderContact)}
          </div>
          <Pager page={favPage} total={favQ.data?.total ?? 0} pageSize={CONTACTS_PAGE} onPage={setFavPage} />
        </>
      )}

      {tab === 'recents' && (
        <>
          <div className="list">
            {callQ.isLoading && <p className="muted">Yukleniyor...</p>}
            {!callQ.isLoading && (callQ.data?.items.length ?? 0) === 0 && (
              <p className="muted">Arama gecmisi yok</p>
            )}
            {callQ.data?.items.map((c) => (
              <div key={c.id} className="row">
                <div className="avatar" style={avatarStyle(c.partnerName)}>{initials(c.partnerName)}</div>
                <div className="row__main">
                  <span className={`row__title ${c.status === 'missed' ? 'is-missed' : ''}`}>{c.partnerName}</span>
                  <span className="row__sub">{callLabel(c)} · {fmtCallTime(c.createdAt)}</span>
                </div>
                <Link to="/messages/$partner" params={{ partner: c.partnerNumber }} className="iconbtn" title="Mesaj">💬</Link>
              </div>
            ))}
          </div>
          <Pager page={callPage} total={callQ.data?.total ?? 0} pageSize={CALLS_PAGE} onPage={setCallPage} />
        </>
      )}

      {tab === 'all' && (
        <>
          <div className="list">
            {allQ.isLoading && <p className="muted">Yukleniyor...</p>}
            {!allQ.isLoading && (allQ.data?.items.length ?? 0) === 0 && (
              <p className="muted">{search ? 'Sonuc yok' : 'Kayitli kisi yok'}</p>
            )}
            {allQ.data?.items.map(renderContact)}
          </div>
          <Pager page={allPage} total={allQ.data?.total ?? 0} pageSize={CONTACTS_PAGE} onPage={setAllPage} />
        </>
      )}
    </div>
  )
}
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AppHeader } from '../../components/AppHeader'
import { CONTACTS_PAGE_SIZE, useContactsPage, useDeleteContact } from '../../hooks/useContacts'

export function ContactsScreen() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isFetching } = useContactsPage(page)
  const del = useDeleteContact()

  const contacts = data?.items ?? []
  const total = data?.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / CONTACTS_PAGE_SIZE))
  const canPrev = page > 0
  const canNext = page + 1 < pageCount

  return (
    <div className="screen">
      <AppHeader
        title="Rehber"
        action={<Link to="/contacts/new" className="appbar__add">＋</Link>}
      />
      <div className="list">
        {isLoading && <p className="muted">Yukleniyor...</p>}
        {!isLoading && total === 0 && <p className="muted">Kayitli kisi yok</p>}
        {contacts.map((c) => (
          <div key={c.id} className="row">
            <div className="row__main">
              <span className="row__title">{c.name}</span>
              <span className="row__sub">{c.phoneNumber}</span>
            </div>
            <div className="row__actions">
              <Link to="/messages/$partner" params={{ partner: c.phoneNumber }} className="row__link">
                Mesaj
              </Link>
              <button className="row__del" onClick={() => del.mutate({ id: c.id, phoneNumber: c.phoneNumber })}>
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
      {total > CONTACTS_PAGE_SIZE && (
        <div className="pager">
          <button className="pager__btn" onClick={() => setPage((p) => p - 1)} disabled={!canPrev || isFetching}>
            ‹ Onceki
          </button>
          <span className="pager__info">{page + 1} / {pageCount}</span>
          <button className="pager__btn" onClick={() => setPage((p) => p + 1)} disabled={!canNext || isFetching}>
            Sonraki ›
          </button>
        </div>
      )}
    </div>
  )
}
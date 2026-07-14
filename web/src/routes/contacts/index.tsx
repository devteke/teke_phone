import { Link } from '@tanstack/react-router'
import { AppHeader } from '../../components/AppHeader'
import { useContacts, useDeleteContact } from '../../hooks/useContacts'

export function ContactsScreen() {
  const { data: contacts = [], isLoading } = useContacts()
  const del = useDeleteContact()

  return (
    <div className="screen">
      <AppHeader
        title="Rehber"
        action={
          <Link to="/contacts/new" className="appbar__add">
            ＋
          </Link>
        }
      />
      <div className="list">
        {isLoading && <p className="muted">Yukleniyor...</p>}
        {!isLoading && contacts.length === 0 && <p className="muted">Kayitli kisi yok</p>}
        {contacts.map((c) => (
          <div key={c.id} className="row">
            <div className="row__main">
              <span className="row__title">{c.name}</span>
              <span className="row__sub">{c.phoneNumber}</span>
            </div>
            <div className="row__actions">
              <Link to="/messages/$partner" params={ { partner: c.phoneNumber } }  className="row__link">
                Mesaj
              </Link>
              <button className="row__del" onClick={() => del.mutate(c.id)}>
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
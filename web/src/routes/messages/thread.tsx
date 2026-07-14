import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { AppHeader } from '../../components/AppHeader'
import { useContacts } from '../../hooks/useContacts'
import { useSendMessage, useThread } from '../../hooks/useMessages'

export function ThreadScreen() {
  const { partner } = useParams({ from: '/messages/$partner' })
  const { data: messages = [] } = useThread(partner)
  const { data: contacts = [] } = useContacts()
  const send = useSendMessage(partner)
  const [text, setText] = useState('')

  // Rehberde kayitliysa ismini, degilse numarayi goster
  const contactName = contacts.find((c) => c.phoneNumber === partner)?.name
  const title = contactName ?? partner

  const onSend = () => {
    const value = text.trim()
    if (!value) return
    send.mutate(value)
    setText('')
  }

  return (
    <div className="screen">
      <AppHeader title={title} />
      <div className="chat">
        {messages.map((m) => (
          <div key={m.id} className={`bubble ${m.isMine ? 'bubble--mine' : ''}`}>
            {m.content}
          </div>
        ))}
      </div>
      <div className="composer">
        <input
          className="composer__input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSend()
          }}
          placeholder="Mesaj yaz..."
        />
        <button className="composer__send" onClick={onSend}>
          Gonder
        </button>
      </div>
    </div>
  )
}
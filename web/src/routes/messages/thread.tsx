import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { AppHeader } from '../../components/AppHeader'
import { useMarkConversationRead, useSendMessage, useThread } from '../../hooks/useMessages'

function formatTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
}

export function ThreadScreen() {
  const { partner } = useParams({ from: '/messages/$partner' })
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useThread(partner)
  const send = useSendMessage(partner)
  const markRead = useMarkConversationRead(partner)
  const [text, setText] = useState('')

  const partnerName = data?.pages[0]?.partnerName ?? partner

  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const firstScrollDone = useRef(false)

  // Sayfalar [yeni, eski, dahaEski] -> ekranda eski->yeni icin ters cevir + duzlestir
  const messages = useMemo(
    () => (data ? [...data.pages].reverse().flatMap((p) => p.items) : []),
    [data],
  )
  const lastId = messages.length ? messages[messages.length - 1]!.id : 0
  const prevLastId = useRef(lastId)

  // Acilista + her yeni mesajda okundu isaretle
  useEffect(() => {
    markRead()
  }, [partner, lastId, markRead])

  // Ilk yuklemede en alta in
  useLayoutEffect(() => {
    if (!firstScrollDone.current && messages.length) {
      bottomRef.current?.scrollIntoView()
      firstScrollDone.current = true
    }
  }, [messages.length])

  // Yeni mesaj gelince, kullanici dibe yakinsa asagi kaydir
  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el || lastId === prevLastId.current) return
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
    if (nearBottom) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    prevLastId.current = lastId
  }, [lastId])

  // Yukari kaydirinca eski mesajlari yukle + scroll konumunu koru
  const onScroll = () => {
    const el = scrollRef.current
    if (!el || isFetchingNextPage || !hasNextPage) return
    if (el.scrollTop <= 40) {
      const prevHeight = el.scrollHeight
      void fetchNextPage().then(() => {
        requestAnimationFrame(() => {
          const next = scrollRef.current
          if (next) next.scrollTop = next.scrollHeight - prevHeight
        })
      })
    }
  }

  const onSend = () => {
    const value = text.trim()
    if (!value) return
    send.mutate(value)
    setText('')
  }

  return (
    <div className="screen">
      <AppHeader title={partnerName} />
      <div className="chat" ref={scrollRef} onScroll={onScroll}>
        {isFetchingNextPage && <div className="chat__loader">Yukleniyor...</div>}
        {messages.map((m) => (
          <div key={m.id} className={`bubble ${m.isMine ? 'bubble--mine' : 'bubble--their'}`}>
            <span className="bubble__text">{m.content}</span>
            <span className="bubble__time">{formatTime(m.createdAt)}</span>
          </div>
        ))}
        <div ref={bottomRef} />
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
        <button className="composer__send" onClick={onSend} disabled={!text.trim()}>
          ➤
        </button>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { AppHeader } from '../../components/AppHeader'
import { useSaveContact } from '../../hooks/useContacts'

export function NewContactScreen() {
  const router = useRouter()
  const save = useSaveContact()
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

const onSave = async () => {
  if (!name.trim() || !phoneNumber.trim()) return
  await save.mutateAsync({ name: name.trim(), phoneNumber: phoneNumber.trim() })
  router.history.back() 
}

  return (
    <div className="screen">
      <AppHeader title="Yeni Kisi" />
      <div className="form">
        <input
          className="form__input"
          placeholder="Isim"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="form__input"
          placeholder="Numara"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button className="form__save" onClick={onSave} disabled={save.isPending}>
          Kaydet
        </button>
      </div>
    </div>
  )
}
import { createContext, useContext, useState } from 'react'

const ModalCtx = createContext(null)

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null) // 'login' | 'signup' | 'contact' | null

  return (
    <ModalCtx.Provider value={{ modal, open: setModal, close: () => setModal(null) }}>
      {children}
    </ModalCtx.Provider>
  )
}

export const useModal = () => useContext(ModalCtx)

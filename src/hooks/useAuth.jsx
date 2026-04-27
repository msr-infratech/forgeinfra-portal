import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('fi-token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      api.me(token)
        .then(setUser)
        .catch(() => { localStorage.removeItem('fi-token'); setToken(null) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email, password) => {
    const data = await api.login(email, password)
    localStorage.setItem('fi-token', data.access_token)
    setToken(data.access_token)
    const me = await api.me(data.access_token)
    setUser(me)
    return me
  }

  const register = async (email, password, full_name) => {
    await api.register(email, password, full_name)
    return login(email, password)
  }

  const logout = () => {
    localStorage.removeItem('fi-token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)

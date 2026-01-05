// dummyUserContext.js
import UserContext from '../contexts/UserContext'
import { vi } from 'vitest'

export const UserContextProvider = ({ children }) => {
  const userState = {
    user: { username: 'root', token: '123' },
    status: 'authenticated',
    error: undefined,
  }

  return (
    <UserContext.Provider
      value={{
        userState,
        login: vi.fn(),
        logout: vi.fn(),
        userDispatch: vi.fn(),
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

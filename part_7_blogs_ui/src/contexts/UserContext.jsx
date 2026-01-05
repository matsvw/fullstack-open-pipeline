import { createContext, useReducer, useEffect, useContext } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import loginService from '../services/login'
import { tokenStore } from '../helpers/tokenStore'
import NotificationContext from './NotificationContext'

const initialAuthState = {
  user: null,
  status: 'idle',
}

const userReducer = (state, action) => {
  console.log('User reducer action:', action)

  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, status: 'loading', error: undefined }
    case 'LOGIN_SUCCESS':
      return { user: action.payload, status: 'authenticated', error: undefined }
    case 'LOGIN_ERROR':
      return { ...state, status: 'error', error: action.payload, user: null }
    case 'LOGOUT':
      return { user: null, status: 'idle', error: undefined }
    case 'COOKIE':
      return action.payload
        ? { user: action.payload, status: 'authenticated', error: undefined }
        : { user: null, status: 'idle', error: undefined }
    default:
      return state
  }
}

const UserContext = createContext({
  userState: null,
  // no-op fallback avoids undefined errors if misused
  userDispatch: () => {},
})

export const UserContextProvider = (props) => {
  const { notificationDispatch } = useContext(NotificationContext)
  const [userState, userDispatch] = useReducer(userReducer, initialAuthState)
  const queryClient = useQueryClient()

  useEffect(() => {
    const user = loginService.loadUser()
    if (user) {
      userDispatch({ type: 'COOKIE', payload: user })
      tokenStore.setToken(user.token)
    }
  }, [])

  const login = async ({ username, password }) => {
    userDispatch({ type: 'LOGIN_START' })
    try {
      const user = await loginService.login({ username, password })
      loginService.saveUser(user)
      userDispatch({ type: 'LOGIN_SUCCESS', payload: user })
      tokenStore.setToken(user.token)
      return { status: 'authenticated', user }
    } catch (error) {
      loginService.saveUser(null)
      tokenStore.setToken(null)
      const message =
        error?.response?.data?.error ?? error?.message ?? 'Unknown login error'
      userDispatch({ type: 'LOGIN_ERROR', payload: message })
      notificationDispatch({ type: 'SHOW_ERROR', payload: 'wrong credentials' })
      return { status: 'error', error: message }
    }
  }

  const logout = () => {
    //setAuthToken(undefined)
    loginService.saveUser(null)
    tokenStore.setToken(null)
    userDispatch({ type: 'LOGOUT' })
    queryClient.clear()
  }

  return (
    <UserContext.Provider value={{ userState, login, logout, userDispatch }}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContext

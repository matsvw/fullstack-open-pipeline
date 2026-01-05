import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  console.log('Notification reducer action:', action)
  switch (action.type) {
    case 'SHOW_ERROR':
      return { isError: true, message: action.payload }
    case 'SHOW_MESSAGE':
      return { isError: false, message: action.payload }
    case 'HIDE':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext({
  notification: null,
  // no-op fallback avoids undefined errors if misused
  notificationDispatch: () => {},
})

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  )

  return (
    <NotificationContext.Provider
      value={{ notification, notificationDispatch }}
    >
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext

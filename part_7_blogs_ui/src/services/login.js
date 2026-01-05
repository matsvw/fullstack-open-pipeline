import axios from 'axios'
const baseUrl = '/api/login'

const loginCookieName = 'loggedNoteAppUser'

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

const saveUser = (user) => {
  window.localStorage.setItem(loginCookieName, JSON.stringify(user))
}

const loadUser = () => {
  const raw = window.localStorage.getItem(loginCookieName)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem(loginCookieName) // invalid data, remove from storage
    return null
  }
}

export default { login, saveUser, loadUser }

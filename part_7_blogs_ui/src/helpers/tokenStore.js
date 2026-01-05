class TokenStore {
  constructor() {
    this.token = null
  }
  setToken(newToken) {
    console.log('Seting token: ', newToken)
    if (newToken) {
      this.token = `Bearer ${newToken}`
    } else {
      this.token = null
    }
  }
  getToken() {
    return this.token
  }
  clear() {
    this.token = null
  }
}

export const tokenStore = new TokenStore()

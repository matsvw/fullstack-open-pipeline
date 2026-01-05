import { vi } from 'vitest'

export default {
  login: vi.fn(() =>
    Promise.resolve({
      user: 'root',
      token: 'fake-jwt-token',
    })
  ),
  saveUser: vi.fn(() => Promise.resolve()),
  loadUser: vi.fn(() => Promise.resolve({ user: 'root' })),
}

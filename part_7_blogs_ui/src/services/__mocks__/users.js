import { vi } from 'vitest'

export default {
  getAll: vi.fn(() =>
    Promise.resolve([
      {
        id: 1,
        username: 'mockuser',
        name: 'Mock User',
      },
    ])
  ),
  getOne: vi.fn(() =>
    Promise.resolve({
      id: 1,
      username: 'mockuser',
      name: 'Mock User',
    })
  ),
  create: vi.fn(() => Promise.resolve({ user: 'root' })),
}

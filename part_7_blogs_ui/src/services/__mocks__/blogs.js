import { vi } from 'vitest'

export default {
  getOne: vi.fn(() => {
    console.log('Mock getOne called')
    return Promise.resolve({
      title: 'Mock Blog',
      author: 'Mock Author',
      url: 'http://mockurl.com',
      likes: 10,
      user: {
        username: 'root',
        name: 'Superuser',
        id: '6929a2222737e354c91e8c1e',
      },
      comments: [],
      id: '123',
    })
  }),
  getAll: vi.fn(() =>
    Promise.resolve([
      {
        title: 'Mock Blog',
        author: 'Mock Author',
        url: 'http://mockurl.com',
        likes: 10,
        comments: [],
        id: '123',
      },
    ])
  ),
  getAllExpanded: vi.fn(() =>
    Promise.resolve([
      {
        title: 'Mock Blog',
        author: 'Mock Author',
        url: 'http://mockurl.com',
        likes: 10,
        user: {
          username: 'root',
          name: 'Superuser',
          id: '6929a2222737e354c91e8c1e',
        },
        comments: [],
        id: '123',
      },
    ])
  ),
  create: vi.fn((newObject) => Promise.resolve({ ...newObject, id: 99 })),
  update: vi.fn((id, newObject) => Promise.resolve({ id, ...newObject })),
  remove: vi.fn((id) => Promise.resolve({ success: true, id })),
}

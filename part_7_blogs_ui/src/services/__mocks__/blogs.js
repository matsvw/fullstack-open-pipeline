import { vi } from "vitest";

export default {
  getAll: vi.fn(() =>
    Promise.resolve([
      {
        id: 1,
        title: "Mock Blog",
        author: "Mock Author",
        url: "http://mockurl.com",
        likes: 10,
      },
    ]),
  ),
  getAllExpanded: vi.fn(() =>
    Promise.resolve([
      {
        id: 1,
        title: "Mock Blog Expanded",
        author: "Mock Author",
        url: "http://mockurl.com",
        likes: 10,
        user: { id: 1, username: "mockuser", name: "Mock User" },
      },
    ]),
  ),
  create: vi.fn((newObject) => Promise.resolve({ ...newObject, id: 99 })),
  update: vi.fn((id, newObject) => Promise.resolve({ id, ...newObject })),
  remove: vi.fn((id) => Promise.resolve({ success: true, id })),
};

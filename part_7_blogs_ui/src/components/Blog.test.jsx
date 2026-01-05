import { render, screen } from "@testing-library/react";
import { expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

vi.mock("../services/blogs"); // Mock the blog service

beforeAll(() => {
  vi.spyOn(window, "confirm").mockImplementation(() => true); // Mock window.confirm to always return true
});

describe("<Blog />", () => {
  const blog = {
    title: "Test blog title",
    author: "Test blog author",
    url: "http://testurl.com",
    likes: 5,
    user: {
      name: "Test User",
      username: "testuser",
    },
  };

  const blogUser = {
    name: "Test User",
    username: "testuser",
  };

  test("renders content", async () => {
    const mockRemovedHandler = vi.fn();
    const mockUpdatedHandler = vi.fn();

    render(
      <Blog
        blog={blog}
        user={blogUser}
        handleBlogRemoved={mockRemovedHandler}
        handleBlogUpdated={mockUpdatedHandler}
      />,
    );
    // user this to dump the rendered HTML to the console
    screen.debug();

    screen.getByText(blog.title);
    const authorElement = screen.queryByText(blog.author);
    const urlElement = screen.queryByText(blog.url);

    expect(!authorElement, "author should not be visible").toBe(true);
    expect(!urlElement, "url should not be visible").toBe(true);
  });

  test("view button works", async () => {
    const mockRemovedHandler = vi.fn();
    const mockUpdatedHandler = vi.fn();

    const user = userEvent.setup();

    render(
      <Blog
        blog={blog}
        user={blogUser}
        handleBlogRemoved={mockRemovedHandler}
        handleBlogUpdated={mockUpdatedHandler}
      />,
    );

    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    screen.getByText(blog.author);
    screen.getByText(blog.url);
  });

  test("like button works", async () => {
    const mockRemovedHandler = vi.fn();
    const mockUpdatedHandler = vi.fn();

    const user = userEvent.setup();

    render(
      <Blog
        blog={blog}
        user={blogUser}
        handleBlogRemoved={mockRemovedHandler}
        handleBlogUpdated={mockUpdatedHandler}
      />,
    );

    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockUpdatedHandler.mock.calls).toHaveLength(2);
    expect(mockRemovedHandler.mock.calls).toHaveLength(0);

    expect(mockUpdatedHandler.mock.calls[0][0].likes).toBe(blog.likes + 1); // as the component state does not update the blog prop, this will not increment more than 1
  });

  test("remove button works", async () => {
    const mockRemovedHandler = vi.fn();
    const mockUpdatedHandler = vi.fn();

    const blogUser = {
      name: "Test User",
      username: "testuser",
    };

    const user = userEvent.setup();

    render(
      <Blog
        blog={blog}
        user={blogUser}
        handleBlogRemoved={mockRemovedHandler}
        handleBlogUpdated={mockUpdatedHandler}
      />,
    );

    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    expect(mockUpdatedHandler.mock.calls).toHaveLength(0);

    const removeButton = screen.getByText("remove");
    await user.click(removeButton);

    expect(mockRemovedHandler.mock.calls).toHaveLength(1);
  });
});

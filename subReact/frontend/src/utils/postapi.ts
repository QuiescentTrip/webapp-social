import type { Post, PostData } from "../types/post";
import type { ErrorResponse } from "../types/ErrorResponse";
import { API_BASE_URL } from "~/lib/constants";

// Update the ErrorResponse type (if it's defined in this file)

export const getPost = async (postId: number): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/post/${postId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ErrorResponse;
    throw new Error(errorData.message);
  }

  return response.json() as Promise<Post>;
};

export const getAllPosts = async (): Promise<Post[]> => {
  const response = await fetch(`${API_BASE_URL}/post`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ErrorResponse;
    throw new Error(errorData.message || "Failed to fetch posts");
  }

  return response.json() as Promise<Post[]>;
};

export const createPost = async (postData: PostData): Promise<Post> => {
  // bare formdata fungerer med fileupload for some reason
  const formData = new FormData();
  formData.append("Title", postData.title);
  formData.append("Image", postData.image);

  const response = await fetch(`${API_BASE_URL}/post`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ErrorResponse;
    throw new Error(errorData.message || "Failed to create post");
  }

  return response.json() as Promise<Post>;
};

export const deletePost = async (postId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/post/${postId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ErrorResponse;
    throw new Error(errorData.message || "Failed to delete post");
  }
};

export const updatePost = async (
  postId: number,
  title: string,
): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/post/${postId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ErrorResponse;
    throw new Error(errorData.message || "Failed to update post");
  }

  return response.json() as Promise<Post>;
};

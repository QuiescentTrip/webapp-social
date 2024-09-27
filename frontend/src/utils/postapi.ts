import type { Post } from "../types/post";
import type { ErrorResponse } from "../types/ErrorResponse";
import { API_BASE_URL } from "./api";

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

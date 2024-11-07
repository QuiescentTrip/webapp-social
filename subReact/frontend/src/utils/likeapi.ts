import { API_BASE_URL } from "~/lib/constants";
import type { ErrorResponse } from "~/types/ErrorResponse";

export const likePost = async (postId: number): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/like/${postId}`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ErrorResponse;
    throw new Error(errorData.message || "Failed to like post");
  }

  const result = (await response.json()) as { message: string };
  return result.message === "Post liked successfully";
};

export const unlikePost = async (postId: number): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/like/${postId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ErrorResponse;
    throw new Error(errorData.message || "Failed to unlike post");
  }

  const result = (await response.json()) as { message: string };
  return result.message === "Post unliked successfully";
};

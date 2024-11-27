import type { Comment, CommentData } from "../types/comment";
import type { ErrorResponse } from "../types/ErrorResponse";
import { API_BASE_URL } from "~/lib/constants";

export const getComments = async (postId: number): Promise<Comment[]> => {
  const response = await fetch(`${API_BASE_URL}/comment?postId=${postId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ErrorResponse;
    throw new Error(errorData.message || "Failed to fetch comments");
  }

  return response.json() as Promise<Comment[]>;
};

export const createComment = async (
  commentData: CommentData,
): Promise<Response> => {
  return await fetch(`${API_BASE_URL}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(commentData),
  });
};

export const updateComment = async (
  commentId: number,
  content: string,
): Promise<Comment> => {
  const response = await fetch(`${API_BASE_URL}/comment/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ErrorResponse;
    throw new Error(errorData.message || "Failed to update comment");
  }

  return response.json() as Promise<Comment>;
};

export const deleteComment = async (commentId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/comment/${commentId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ErrorResponse;
    throw new Error(errorData.message || "Failed to delete comment");
  }
};

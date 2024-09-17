const API_BASE_URL = "http://localhost:5193/api";
import type {
  UserData,
  SuccessResponse,
  ErrorResponse,
  Post,
} from "~/types/post";

export const register = async (
  userData: UserData,
): Promise<SuccessResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ErrorResponse;
    throw new Error(errorData.message || "Registration failed");
  }

  return response.json() as Promise<SuccessResponse>;
};

export const getPost = async (postId: number): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/post/${postId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ErrorResponse;
    throw new Error(errorData.message || "Failed to fetch post");
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

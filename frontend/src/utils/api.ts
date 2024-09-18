const API_BASE_URL = "http://localhost:5193/api";
import type {
  UserData,
  ErrorResponse,
  Post,
  LoginCredentials,
} from "~/types/post";

export const register = async (userData: UserData): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}/Auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return response;
};

export const login = async (
  credentials: LoginCredentials,
): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}/Auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return response;
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

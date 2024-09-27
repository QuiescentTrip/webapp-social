const API_BASE_URL = "http://localhost:5193/api";

export type UserInfo = {
  userName: string;
  email: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  username: string;
  password: string;
};

export type Post = {
  id: number;
  // Add other properties of Post as needed
};

export type ErrorResponse = {
  message: string;
  // Add other properties of ErrorResponse as needed
};

export const register = async (userData: RegisterData): Promise<Response> => {
  return fetch(`${API_BASE_URL}/Auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
    credentials: "include",
  });
};

export const login = async (
  credentials: LoginCredentials,
): Promise<Response> => {
  return fetch(`${API_BASE_URL}/Auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include",
  });
};

export const logout = async (): Promise<Response> => {
  return fetch(`${API_BASE_URL}/Auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};

export const getUserInfo = async (): Promise<UserInfo> => {
  const response = await fetch(`${API_BASE_URL}/Auth/user`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }
  return response.json() as Promise<UserInfo>;
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

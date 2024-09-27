import { API_BASE_URL } from "./api";
import type { RegisterData, LoginCredentials, UserInfo } from "../types/user";

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

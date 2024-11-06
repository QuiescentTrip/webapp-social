export interface UserInfo {
  id: string;
  username: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  roles?: string[];
}

export interface RegisterData {
  email: string;
  name: string;
  username: string;
  password: string;
}
export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  username: string;
  message: string;
  userId: string;
};

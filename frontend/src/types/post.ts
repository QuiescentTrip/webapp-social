export interface UserData {
  email: string;
  name: string;
  username: string;
  password: string;
}

export interface ErrorResponse {
  message: string;
}

export interface SuccessResponse {
  message: string;
}

export interface Post {
  id: number;
  title: string;
  imageUrl: string;
  likes: number;
  created: string;
  userId: string;
  comments: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  postId: number;
  created: string;
  userId: string;
}

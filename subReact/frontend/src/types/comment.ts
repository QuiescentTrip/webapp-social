import type { UserInfo } from "~/types/user";
export interface Comment {
  id: number;
  content: string;
  postId: number;
  created: string;
  user: UserInfo;
}

export interface CommentData {
  content: string;
  postId: number;
}

import type { UserInfo } from "~/types/user";
import type { Comment } from "~/types/comment";
export interface Post {
  id: number;
  title: string;
  imageUrl: string;
  likes: number;
  created: string;
  user: UserInfo;
  comments: Comment[];
}
export interface PostData {
  title: string;
  image: File;
}

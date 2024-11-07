import type { UserInfo } from "~/types/user";
import type { Comment } from "~/types/comment";
import type { Like } from "~/types/like";
export interface Post {
  id: number;
  title: string;
  imageUrl: string;
  created: string;
  user: UserInfo;
  comments: Comment[];
  likesCount: number;
  likes: Like[];
}
export interface PostData {
  title: string;
  image: File;
}

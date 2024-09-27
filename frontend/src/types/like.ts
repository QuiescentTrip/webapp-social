import type { UserInfo } from "./user";
import type { Post } from "./post";

export interface Like {
  id: number;
  user: UserInfo;
  post: Post;
}

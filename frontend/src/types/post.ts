export interface Post {
  id: number;
  title: string;
  imageUrl: string;
  likes: number;
  created: string;
  userId: string;
  comments: Comment[];
}

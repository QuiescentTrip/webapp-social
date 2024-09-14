interface Post {
  id: number;
  title: string;
  imageUrl: string;
  likesCount: number;
  createdAt: string;
  comments: Comment[];
}

interface Comment {
  id: number;
  content: string;
  postId: number;
  createdAt: string;
}

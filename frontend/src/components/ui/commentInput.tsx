import { createComment } from "~/utils/commentapi";
import type { Comment as CommentType } from "~/types/comment";
import { useAuth } from "~/contexts/AuthContext";
import { useToast } from "~/hooks/use-toast";

export function CommentInput({
  commentText,
  setCommentText,
  id,
  comments,
}: {
  commentText: string;
  setCommentText: (text: string) => void;
  id: number;
  comments: CommentType[];
}): JSX.Element {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to comment.",
        variant: "destructive",
      });
      return;
    }
    if (commentText.trim()) {
      try {
        const newComment = await createComment({
          content: commentText,
          postId: id,
        });
        if (newComment) {
          comments.push(newComment);
          setCommentText(""); // Clear the input field
          toast({
            title: "Comment posted",
            description: "Your comment has been added successfully.",
          });
        }
      } catch (error) {
        console.error("Error posting comment:", error);
        toast({
          title: "Error",
          description: "Failed to post comment. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-50 sm:flex-row sm:gap-0">
      <input
        type="text"
        placeholder="Write a comment..."
        value={commentText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setCommentText(e.target.value)
        }
        className="flex-grow rounded-md border px-2 py-1 focus:outline-none sm:rounded-r-none"
      />
      <button
        onClick={handleSubmit}
        className="rounded-md bg-primary px-4 py-1 text-white focus:outline-none dark:text-black sm:rounded-l-none"
      >
        Post
      </button>
    </div>
  );
}

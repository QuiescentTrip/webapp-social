import { createComment } from "~/utils/commentapi";
import type { Comment as CommentType } from "~/types/comment";
import { useAuth } from "~/contexts/AuthContext";
import { useToast } from "~/hooks/use-toast";
import type { ErrorResponse } from "~/types/ErrorResponse";

export function CommentInput({
  commentText,
  setCommentText,
  id,
  comments,
  setComments,
}: {
  commentText: string;
  setCommentText: (text: string) => void;
  id: number;
  comments: CommentType[];
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
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
        const response = await createComment({
          content: commentText,
          postId: id,
        });

        if (response.ok) {
          const newComment = (await response.json()) as CommentType;
          setComments([...comments, newComment]);
          setCommentText("");
          toast({
            title: "Comment posted",
            description: "Your comment has been added successfully.",
          });
        } else {
          const errorData = (await response.json()) as ErrorResponse;
          if (errorData.errors) {
            Object.entries(errorData.errors).forEach(([key, messages]) => {
              messages.forEach((message) => {
                toast({
                  variant: "destructive",
                  title: `${key} Error`,
                  description: message,
                });
              });
            });
          } else {
            toast({
              variant: "destructive",
              title: "Comment failed",
              description: errorData.title ?? "An error occurred",
            });
          }
        }
      } catch {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred",
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

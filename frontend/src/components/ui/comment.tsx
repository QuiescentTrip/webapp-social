import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import Link from "next/link";
import { Button } from "./button";
import { TrashIcon } from "@radix-ui/react-icons";
import { useAuth } from "~/contexts/AuthContext";
import { deleteComment } from "~/utils/commentapi";
import { useToast } from "~/hooks/use-toast";

interface CommentProps {
  avatarSrc: string;
  avatarFallback: string;
  name: string;
  content: string;
  commentId: number;
  username: string;
  onDelete?: () => void;
}

const Comment: React.FC<CommentProps> = ({
  avatarSrc,
  avatarFallback,
  name,
  content,
  commentId,
  username,
  onDelete,
}) => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteComment(commentId);
      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully.",
      });
      onDelete?.();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="z-20 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={avatarSrc} alt={name} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="break-words">
          <Link href="#" className="mr-2 font-medium" prefetch={false}>
            {name}
          </Link>
          <span className="break-all">{content}</span>
        </div>
      </div>
      {user && (user.username === username || isAdmin()) && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="h-8 w-8"
        >
          <TrashIcon className="h-4 w-4" />
          <span className="sr-only">Delete comment</span>
        </Button>
      )}
    </div>
  );
};

export default Comment;

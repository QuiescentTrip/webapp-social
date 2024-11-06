import { ScrollArea } from "~/components/ui/scroll-area";
import Comment from "~/components/ui/comment";
import type { Comment as CommentType } from "~/types/comment";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { CommentInput } from "~/components/ui/commentInput";
import { useState, useEffect } from "react";

export const ShowComments = ({
  comments,
  loggedin,
  commentText,
  setCommentText,
  id,
}: {
  comments: CommentType[];
  loggedin: boolean;
  commentText: string;
  setCommentText: (text: string) => void;
  id: number;
}) => {
  const [localComments, setLocalComments] = useState<CommentType[]>(comments);

  // Update local comments when props change
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  return (
    <>
      <DialogContent className="max-h-[80vh] w-[90vw] max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
          <DialogDescription>
            View and add comments for this post.
          </DialogDescription>
        </DialogHeader>
        <div className="flex min-h-[300px] flex-col gap-2">
          <ScrollArea className="w-full flex-grow gap-4 rounded-md border p-4">
            <div className="flex flex-col gap-2">
              {localComments.length > 0 ? (
                localComments.map((comment) => (
                  <Comment
                    key={comment.id}
                    content={comment.content}
                    name={comment.user.name}
                    avatarSrc={""}
                    avatarFallback={comment.user.name.slice(0, 2)}
                    commentId={comment.id}
                    username={comment.user.username}
                    onDelete={() => {
                      setLocalComments(
                        localComments.filter((c) => c.id !== comment.id),
                      );
                    }}
                  />
                ))
              ) : loggedin ? (
                <p className="text-sm text-muted-foreground">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No comments yet. Please log in to comment!
                </p>
              )}
            </div>
          </ScrollArea>
          {loggedin && (
            <div className="z-10 mt-2">
              <CommentInput
                commentText={commentText}
                setCommentText={setCommentText}
                id={id}
                comments={localComments}
                setComments={setLocalComments}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </>
  );
};

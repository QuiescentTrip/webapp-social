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
import { UPLOAD_BASE_URL } from "~/lib/constants";

export const ShowComments = ({
  comments,
  loggedin,
  commentText,
  setCommentText,
  id,
  setComments,
}: {
  comments: CommentType[];
  loggedin: boolean;
  commentText: string;
  setCommentText: (text: string) => void;
  id: number;
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
}) => {
  return (
    <>
      <DialogContent className="max-h-[80vh] w-[90vw] max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
          <DialogDescription>
            {loggedin
              ? "View and add comments for this post."
              : "Please login to comment"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex h-[calc(80vh-180px)] flex-col gap-2">
          <ScrollArea className="h-full w-full flex-grow rounded-md border p-4">
            <div className="flex flex-col gap-2">
              {comments.length > 0 ? (
                [...comments]
                  // sort by newest
                  .sort(
                    (a, b) =>
                      new Date(b.created).getTime() -
                      new Date(a.created).getTime(),
                  )
                  .map((comment) => (
                    <Comment
                      key={comment.id}
                      content={comment.content}
                      name={comment.user.name}
                      avatarSrc={`${UPLOAD_BASE_URL}${comment.user.profilePictureUrl}`}
                      avatarFallback={comment.user.name.slice(0, 2)}
                      commentId={comment.id}
                      username={comment.user.username}
                      onDelete={() => {
                        setComments(
                          comments.filter((c) => c.id !== comment.id),
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
                comments={comments}
                setComments={setComments}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </>
  );
};

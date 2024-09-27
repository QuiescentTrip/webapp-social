/* eslint-disable @next/next/no-img-element */
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import Comment from "./ui/comment";
import React, { useState } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { likePost, unlikePost } from "~/utils/likeapi";
import type { Comment as CommentType } from "~/types/comment";
import { HeartIcon, MessageCircleIcon } from "~/components/ui/icons";
import { useToast } from "~/hooks/use-toast";
import { MAX_COMMENT_PER_POST } from "~/lib/constants";
import { ShowComments } from "./ui/showComments";
import { CommentInput } from "./ui/commentInput";
import { Dialog, DialogTrigger } from "./ui/dialog";
import type { Like } from "~/types/like";
interface ComponentProps {
  id: number; // Change this to an array of user IDs who liked the post
  imageUrl: string;
  created: string;
  title: string;
  name: string;
  comments: CommentType[];
  likesCount: number;
  likes: Like[];
}

export default function Component({
  id,
  likes,
  imageUrl,
  created,
  title,
  name,
  comments,
  likesCount: initialLikesCount,
}: ComponentProps): JSX.Element {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState<boolean>(
    user ? likes.some((like) => like.user.name === user.username) : false,
  );
  const [likesCount, setLikesCount] = useState<number>(initialLikesCount);
  const [commentText, setCommentText] = useState<string>("");

  const { toast } = useToast();
  const handleLikeClick = async () => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to like posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!isLiked) {
        await likePost(id);
        setLikesCount((prev) => prev + 1);
      } else {
        await unlikePost(id);
        setLikesCount((prev) => prev - 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  return (
    <Dialog>
      <div className="mx-auto w-full max-w-[80%] rounded-xl outline outline-1 outline-gray-300 lg:max-w-[60%] 2xl:max-w-[40%]">
        <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
          <img
            src={imageUrl}
            alt="Post Image"
            width={600}
            height={400}
            className="h-full w-full object-cover"
            style={{ aspectRatio: "600/400", objectFit: "cover" }}
          />
        </div>
        <div className="rounded-b-lg bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage alt="@shadcn" />
                <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{name}</div>{" "}
                {/* Change this line */}
                <div className="text-sm text-muted-foreground">
                  {new Date(created).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-l">{title}</h2>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={isLiked ? "default" : "ghost"}
                  size="icon"
                  onClick={handleLikeClick}
                >
                  <HeartIcon
                    className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                  />
                  <span className="sr-only">Like</span>
                </Button>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MessageCircleIcon className="h-4 w-4" />
                    <span className="sr-only">View Comments</span>
                  </Button>
                </DialogTrigger>
                <ShowComments
                  comments={comments}
                  loggedin={!!user}
                  commentText={commentText}
                  setCommentText={setCommentText}
                  id={id}
                />
              </div>
              <div className="text-sm font-medium">
                <span className="text-primary">{likesCount}</span>{" "}
                {likesCount === 1 ? "like" : "likes"}
              </div>
            </div>
            {!!user && (
              <CommentInput
                commentText={commentText}
                setCommentText={setCommentText}
                id={id}
                comments={comments}
              />
            )}
          </div>
          <div className="mt-4 space-y-2">
            {comments.length > 0 ? (
              <>
                {/* This sorts comments by created date,
              and then slices the first 3 comments
              Fuck this shit
              */}
                {[...comments]
                  .sort(
                    (a, b) =>
                      new Date(b.created).getTime() -
                      new Date(a.created).getTime(),
                  )
                  .slice(0, MAX_COMMENT_PER_POST)
                  .map((comment, index) => (
                    <Comment
                      key={index}
                      content={comment.content}
                      name={comment.user.name}
                      avatarSrc={""}
                      avatarFallback={comment.user.name.slice(0, 2)}
                    />
                  ))}
                {comments.length > 3 && (
                  <DialogTrigger asChild>
                    <p className="cursor-pointer text-center text-sm text-muted-foreground hover:underline">
                      {comments.length - MAX_COMMENT_PER_POST} more{" "}
                      {comments.length - MAX_COMMENT_PER_POST === 1
                        ? "comment"
                        : "comments"}
                      !
                    </p>
                  </DialogTrigger>
                )}
              </>
            ) : !!user ? (
              <p className="text-sm text-muted-foreground">
                Be the first to comment!
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Please log in to comment!
              </p>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}

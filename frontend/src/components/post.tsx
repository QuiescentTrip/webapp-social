/* eslint-disable @next/next/no-img-element */
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import Comment from "./ui/comment";
import React, { useState } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { likePost, unlikePost } from "~/utils/postapi";
import { createComment } from "~/utils/commentapi";
import type { Comment as CommentType } from "~/types/comment";
import { HeartIcon, MessageCircleIcon } from "~/components/ui/icons";
import { useToast } from "~/hooks/use-toast";

interface ComponentProps {
  id: number; // Add this line
  likes: number;
  imageUrl: string;
  created: string;
  title: string;
  name: string;
  comments: CommentType[];
}

export default function Component({
  id,
  likes: initialLikes,
  imageUrl,
  created,
  title,
  name,
  comments,
}: ComponentProps): JSX.Element {
  const [commentText, setCommentText] = useState<string>("");
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(initialLikes);

  const { user } = useAuth();
  const loggedin = !!user;
  const { toast } = useToast();
  const handleLikeClick = async () => {
    if (!loggedin) {
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
              <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
              <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{name}</div> {/* Change this line */}
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
              <Button variant="ghost" size="icon">
                <MessageCircleIcon className="h-4 w-4" />
                <span className="sr-only">Comment</span>
              </Button>
            </div>
            <div className="text-sm font-medium">
              <span className="text-primary">{likesCount}</span>{" "}
              {likesCount === 1 ? "like" : "likes"}
            </div>
          </div>
          {loggedin && (
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
                .slice(0, 3)
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
                <p className="text-center text-sm text-muted-foreground">
                  {comments.length - 3} more{" "}
                  {comments.length - 3 === 1 ? "comment" : "comments"}!
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CommentInput({
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment = await createComment({
        content: commentText,
        postId: id,
      });
      if (newComment) {
        // Assuming you have a function to add the new comment to the existing comments
        comments.push(newComment);
        setCommentText(""); // Clear the input field
      }
    }
  };

  return (
    <div className="flex rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-50">
      <input
        type="text"
        placeholder="Write a comment..."
        value={commentText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setCommentText(e.target.value)
        }
        className="flex-grow rounded-l-md border px-2 py-1 focus:outline-none"
      />
      <button
        onClick={handleSubmit}
        className="rounded-r-md bg-primary px-4 py-1 text-white focus:outline-none dark:text-black"
      >
        Post
      </button>
    </div>
  );
}

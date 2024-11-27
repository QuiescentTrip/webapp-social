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
import { MoreOptions } from "./more-options";
import type { UserInfo } from "~/types/user";
import TextInput from "./ui/text-input";
import { updatePost } from "~/utils/postapi";

interface ComponentProps {
  id: number;
  imageUrl: string;
  created: string;
  title: string;
  creator: UserInfo;
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
  creator,
  comments: initialComments,
  likesCount: initialLikesCount,
}: ComponentProps): JSX.Element {
  const { user, isAdmin } = useAuth();
  const [isLiked, setIsLiked] = useState<boolean>(
    user ? likes.some((like) => like.user.name === user.username) : false,
  );
  const [likesCount, setLikesCount] = useState<number>(initialLikesCount);
  const [commentText, setCommentText] = useState<string>("");
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(title);
  const { toast } = useToast();
  const [comments, setComments] = useState<CommentType[]>(initialComments);

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
    } catch {
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    setIsDeleted(true);
    toast({
      title: "Post deleted",
      description: "The post has been deleted.",
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    setIsEditing(false);
    await updatePost(id, editedTitle).then(() => {
      toast({
        title: "Post updated",
        description: "The post has been updated.",
      });
    });
  };

  return (
    <div className={isDeleted ? "hidden" : ""}>
      <Dialog>
        <div className="mx-auto w-full max-w-[80%] rounded-xl outline outline-1 outline-gray-300 lg:max-w-[60%] 2xl:max-w-[40%]">
          {/* Post Image */}
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

          {/* Post Content */}
          <div className="rounded-b-lg bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage alt="@shadcn" />
                  <AvatarFallback>{creator.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{creator.name}</div>{" "}
                  {/* Post Date */}
                  <div className="text-sm text-muted-foreground">
                    {new Date(created).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Post Title */}
            <div className="mb-4">
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <TextInput
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    id="title"
                    type="text"
                    label="Title"
                  />
                  <Button onClick={handleUpdate}>Update</Button>
                </div>
              ) : (
                <h2 className="text-l">
                  {editedTitle === "" ? title : editedTitle}
                </h2>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Like Button */}
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

                  {/* View Comments Button With DialogTrigger for the ShowComments component */}
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

                  {/* More Options for post if user is the creator or is admin */}
                  {user &&
                    (user.username === creator.username || isAdmin()) && (
                      <MoreOptions
                        id={id}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        user={user}
                        creator={creator}
                      />
                    )}

                  <ShowComments
                    comments={comments}
                    loggedin={!!user}
                    commentText={commentText}
                    setCommentText={setCommentText}
                    id={id}
                  />
                </div>

                {/* Likes Count */}
                <div className="text-sm font-medium">
                  <span className="text-primary">{likesCount}</span>{" "}
                  {likesCount === 1 ? "like" : "likes"}
                </div>
              </div>

              {/* Comment Input */}
              {!!user && (
                <div>
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

            {/* Comments */}
            <div className="mt-4 space-y-2">
              {comments.length > 0 ? (
                <>
                  {/* This sorts comments by created date,
              and then slices the first 3 comments
              Fuck this shit */}
                  {[...comments]
                    //Sorts by newest
                    .sort(
                      (a, b) =>
                        new Date(b.created).getTime() -
                        new Date(a.created).getTime(),
                    )

                    //Slices the first 3 comments
                    .slice(0, MAX_COMMENT_PER_POST)

                    //Maps the comments to the Comment component
                    .map((comment, _) => (
                      <Comment
                        key={comment.id}
                        content={comment.content}
                        name={comment.user.name}
                        avatarSrc={""}
                        avatarFallback={comment.user.name.slice(0, 2)}
                        commentId={comment.id}
                        username={comment.user.username}
                        onDelete={() => {
                          setComments(
                            comments.filter((c) => c.id !== comment.id),
                          );
                        }}
                      />
                    ))}

                  {/* Show More Comments Button */}
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
    </div>
  );
}

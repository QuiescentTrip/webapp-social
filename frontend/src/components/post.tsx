/* eslint-disable @next/next/no-img-element */
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import Comment from "./ui/comment";
import React, { useState } from "react";
import { type SVGProps } from "react";
import { useAuth } from "~/contexts/AuthContext";

interface ComponentProps {
  likes: number;
  imageUrl: string;
}

interface CommentData {
  avatarSrc: string;
  avatarFallback: string;
  name: string;
  content: string;
}

const exampleComments: CommentData[] = [
  {
    avatarSrc: "https://picsum.photos/250/250",
    avatarFallback: "AC",
    name: "john",
    content: "Wow, this photo is absolutely stunning! 😍✨",
  },
  {
    avatarSrc: "https://picsum.photos/250/250",
    avatarFallback: "AC",
    name: "amelia",
    content: "This post just made my day! 😃👍",
  },
  {
    avatarSrc: "https://picsum.photos/250/250",
    avatarFallback: "AC",
    name: "jane",
    content: "This is a beautiful photo! 🌸🌟",
  },
];

export default function Component({
  likes,
  imageUrl,
}: ComponentProps): JSX.Element {
  const [commentText, setCommentText] = useState<string>("");

  const { user } = useAuth();
  const loggedin = !!user;

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
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Acme Inc</div>
              <div className="text-sm text-muted-foreground">2 hours ago</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <HeartIcon className="h-4 w-4" />
                <span className="sr-only">Like</span>
              </Button>
              <Button variant="ghost" size="icon">
                <MessageCircleIcon className="h-4 w-4" />
                <span className="sr-only">Comment</span>
              </Button>
            </div>
            <div className="text-sm font-medium">
              <span className="text-primary">{likes}</span>{" "}
              {likes === 1 ? "like" : "likes"}
            </div>
          </div>
          {loggedin && (
            <CommentInput
              commentText={commentText}
              setCommentText={setCommentText}
            />
          )}
        </div>
        <div className="mt-4 space-y-2">
          {exampleComments.map((comment, index) => (
            <Comment key={index} {...comment} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CommentInput({
  commentText,
  setCommentText,
}: {
  commentText: string;
  setCommentText: (text: string) => void;
}): JSX.Element {
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
        type="submit"
        className="rounded-r-md bg-primary px-4 py-1 text-white focus:outline-none dark:text-black"
      >
        Post
      </button>
    </div>
  );
}

function HeartIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function MessageCircleIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

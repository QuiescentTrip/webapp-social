import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import Link from "next/link";

interface CommentProps {
  avatarSrc: string;
  avatarFallback: string;
  name: string;
  content: string;
}

const Comment: React.FC<CommentProps> = ({
  avatarSrc,
  avatarFallback,
  name,
  content,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src={avatarSrc} alt={name} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
      <div>
        <Link href="#" className="mr-2 font-medium" prefetch={false}>
          {name}
        </Link>
        {content}
      </div>
    </div>
  );
};

export default Comment;

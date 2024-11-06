import React, { useState } from "react";
import { deletePost } from "~/utils/postapi";
import { Button } from "./ui/button";
import { useAuth } from "~/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { EllipsisIcon } from "~/components/ui/icons";
interface MoreOptionsProps {
  id: number;
  onDelete?: () => void;
  onEdit?: () => void;
  user: UserInfo;
  creator: UserInfo;
}
import type { UserInfo } from "~/types/user";

export function MoreOptions({
  id,
  onDelete,
  onEdit,
  user,
  creator,
}: MoreOptionsProps) {
  const [isMoreOptionsActive, setIsMoreOptionsActive] = useState(false);

  const handleDelete = async () => {
    await deletePost(id);
    onDelete?.();
  };

  return (
    <DropdownMenu onOpenChange={(open) => setIsMoreOptionsActive(open)}>
      <DropdownMenuTrigger asChild>
        <Button variant={isMoreOptionsActive ? "default" : "ghost"} size="icon">
          <EllipsisIcon
            className={`h-4 w-4 ${isMoreOptionsActive ? "fill-current" : ""}`}
          />
          <span className="sr-only">More options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {user && user.username === creator.username && (
          <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

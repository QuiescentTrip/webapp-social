import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { EllipsisIcon } from "~/components/ui/icons";

export function MoreOptions() {
  const [isMoreOptionsActive, setIsMoreOptionsActive] = useState(false);

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
        {/* TODO: add edit and delete functionality */}
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import React from "react";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/togglebutton";
import Link from "next/link";
import { useAuth } from "~/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { UPLOAD_BASE_URL } from "~/lib/constants";

export default function Component(): JSX.Element {
  const { user, logout } = useAuth();
  return (
    <nav className="flex items-center justify-between gap-4 p-4 sm:flex-row">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <h1 className="xxs:inline hidden transform cursor-pointer text-center text-xl font-bold transition-all duration-300 hover:-rotate-6 hover:scale-110 hover:animate-rainbow">
              SlowGram
            </h1>
            <h1 className="xxs:hidden transform cursor-pointer text-center text-xl font-bold transition-all duration-300 hover:-rotate-6 hover:scale-110 hover:animate-rainbow">
              SG
            </h1>
          </Link>
        </div>
        {user && (
          <Link href="/create-post">
            <Button>
              <span className="hidden sm:inline">Create Post+</span>
              <span className="inline sm:hidden">+</span>
            </Button>
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
        {!user ? (
          <div className="flex gap-4">
            <Link href="/login">
              <Button>Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Avatar className="h-9 w-9 transition-opacity hover:opacity-80">
                <AvatarImage
                  src={`${UPLOAD_BASE_URL}/${user.profilePictureUrl}`}
                />
                <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </Link>
            <Button onClick={() => logout()}>Logout</Button>
          </div>
        )}
      </div>
    </nav>
  );
}

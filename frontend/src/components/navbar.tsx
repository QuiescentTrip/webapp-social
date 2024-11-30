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
    <nav className="flex flex-row items-center justify-between p-4">
      <div className="flex flex-row items-center justify-center gap-4">
        <div className="flex flex-row items-center justify-center gap-4">
          <Link href="/">
            <h1 className="transform cursor-pointer text-center text-xl font-bold transition-all duration-300 hover:-rotate-6 hover:scale-110 hover:animate-rainbow">
              SlowGram
            </h1>
          </Link>
        </div>
        {user && (
          <Link href="/create-post">
            <Button className="mr-4">Create Post+</Button>
          </Link>
        )}
      </div>
      <div className="flex h-[36px] flex-row gap-4">
        <ModeToggle />
        {!user ? (
          <>
            <Link href="/login">
              <Button>Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/profile">
              <Avatar className="h-9 w-9 transition-opacity hover:opacity-80">
                <AvatarImage
                  src={`${UPLOAD_BASE_URL}/${user.profilePictureUrl}`}
                />
                <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </Link>
            <Button onClick={() => logout()}>Logout</Button>
          </>
        )}
      </div>
    </nav>
  );
}

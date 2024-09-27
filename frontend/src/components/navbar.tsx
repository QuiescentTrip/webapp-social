import React from "react";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/togglebutton";
import Link from "next/link";
import { useAuth } from "~/contexts/AuthContext";

export default function Component(): JSX.Element {
  const { user, logout } = useAuth();
  return (
    <nav className="flex flex-row items-center justify-between p-4">
      <div className="flex flex-row items-center justify-center gap-4">
        <div className="flex flex-row items-center justify-center gap-4">
          <Link href="/">
            <h1 className="text-center">Social Media</h1>
          </Link>
        </div>
        {user && (
          <Link href="/create-post">
            <Button>Create Post+</Button>
          </Link>
        )}
      </div>
      <div className="flex flex-row gap-4">
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
            <span className="text-l flex items-center justify-center text-center">
              {user.userName}
            </span>
            <Button onClick={() => logout()}>Logout</Button>
          </>
        )}
      </div>
    </nav>
  );
}

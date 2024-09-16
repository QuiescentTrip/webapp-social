/**
 * v0 by Vercel.
 * @see https://v0.dev/t/1TGqjuhGPnB
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"
import Link from "next/link"
import React from "react"

export default function Component(): JSX.Element {
  return (
    <div className="w-full max-w-[40%] mx-auto">
      <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
        <img
          src="https://picsum.photos/1000/1000"
          alt="Post Image"
          width={600}
          height={400}
          className="object-cover w-full h-full"
          style={{ aspectRatio: "600/400", objectFit: "cover" }}
        />
      </div>
      <div className="bg-card p-4 rounded-b-lg">
        <div className="flex items-center justify-between mb-4">
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <HeartIcon className="w-4 h-4" />
              <span className="sr-only">Like</span>
            </Button>
            <Button variant="ghost" size="icon">
              <MessageCircleIcon className="w-4 h-4" />
              <span className="sr-only">Comment</span>
            </Button>
          </div>
          <div className="text-sm font-medium">
            <span className="text-primary">1,234</span> likes
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div>
              <Link href="#" className="font-medium" prefetch={false}>
                john
              </Link>
              Wow, this photo is absolutely stunning! 😍✨
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div>
              <Link href="#" className="font-medium" prefetch={false}>
                amelia
              </Link>
              This post just made my day! 😃👍
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div>
              <Link href="#" className="font-medium" prefetch={false}>
                emily
              </Link>
              I love the colors in this photo! 🌈
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface IconProps extends React.SVGProps<SVGSVGElement> {}



function HeartIcon(props: IconProps): JSX.Element {
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
  )
}

function MessageCircleIcon(props: IconProps): JSX.Element {
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
  )
}


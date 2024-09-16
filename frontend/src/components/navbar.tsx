import React from "react"
import { Button } from "./ui/button"
import { ModeToggle } from "./ui/togglebutton"
import Link from "next/link"

export default function Component(): JSX.Element {
    return (
        <nav className="flex flex-row justify-between items-center p-4">
                <Link href="/"><h1 >Social Media</h1></Link>
                <div className="flex flex-row gap-4">
                    <ModeToggle />
                    <Link href="/login"><Button>Login</Button></Link>
                    <Link href="/register"><Button>Register</Button></Link>
                </div>
        </nav>
    )
}
import React from "react"
import { Button } from "./ui/button"

export default function Component(): JSX.Element {
    return (
        <nav className="flex flex-row justify-between items-center p-4">
                <h1>Social Media</h1>
                <div className="flex flex-row gap-4">
                    <Button>Login</Button>
                    <Button>Register</Button>
                </div>
        </nav>
    )
}
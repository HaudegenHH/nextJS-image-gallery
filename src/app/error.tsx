"use client";

import { Button } from "react-bootstrap";


interface ErrorPageProps {
    error: Error,
    reset: () => void
}

export default function Error({error, reset} : ErrorPageProps) {
  return (
    <div>
        <h1>An error occured 😱</h1>
        <Button onClick={reset}>Try again</Button>
    </div>
  )
}

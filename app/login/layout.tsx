import React, { Suspense } from "react"

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      {children}
    </Suspense>
  )
}

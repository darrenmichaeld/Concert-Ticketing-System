import React from "react"

interface ContainerProps {
  children: React.ReactNode
}

export function Container({ children }: ContainerProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-1">{children}</main>
    </div>
  )
}


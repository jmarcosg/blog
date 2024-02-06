"use client"

import { useScroll } from "@/hooks"
import { cn } from "@/utils"
import { useSearchParams } from "next/navigation"

export const Background = () => {
  useSearchParams()
  const { scrolled } = useScroll(0)

  return (
    <div
      className={cn(
        "bg-background/70 absolute left-0 top-0 z-[-1] h-full w-full opacity-0 shadow-md backdrop-blur-md transition-all",
        { "opacity-100": scrolled }
      )}
    />
  )
}

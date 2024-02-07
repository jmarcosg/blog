"use client"

import { links } from "@/lib/links";
import { cn } from "@/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface INav {
	direction?: "column" | "row";
	onNavItemClick?: () => void;
}

export const Nav = (props: INav) => {
	const { direction = "row", onNavItemClick } = props;
  const pathname = usePathname()

  return (
    <nav
      className={cn("flex space-x-0 sm:space-x-2", {
        "flex-col items-stretch": direction === "column",
      })}
    >
      {links?.map(
        (link, index) =>
          link.hash && (
            <Link
              key={index}
              href={link.hash}
              className={cn(
                "hover:text-foreground flex items-center justify-center rounded-lg px-5 py-2 text-sm font-medium transition-all"
              )}
              onClick={onNavItemClick}
            >
              {link.name}
            </Link>
          )
      )}
    </nav>
  )
}

"use client";

import { cn } from "@/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface INav {
	direction?: "column" | "row";
	onNavItemClick?: () => void;
}

export const Nav = (props: INav) => {
	const { direction = "row", onNavItemClick } = props;
	const pathname = usePathname();

	return (
		<nav
			className={cn("flex space-x-0 sm:space-x-2", {
				"flex-col items-stretch": direction === "column",
			})}
		>
			<Link
				href="www.jmarcosg.dev"
				className={cn(
					"hover:text-foreground flex items-center justify-center rounded-lg px-5 py-2 text-sm font-medium transition-all",
				)}
				onClick={onNavItemClick}
			>
				Portfolio
			</Link>
		</nav>
	);
};

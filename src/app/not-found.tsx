"use client";

import {
	Button,
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="pt-8">
			<div className="bg-[#fbe2e3] absolute top-[-20rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#946263]" />
			<div className="bg-[#dbd7fb] absolute top-[-15rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#676394]" />

			<div className="flex items-center justify-center mt-20">
				<Card className="w-[420px] bg-[rgba(50,50,50,0.1)] dark:bg-[rgba(230,230,230,0.1)] border-none">
					<CardHeader className="text-center">
						<CardTitle className="lg:text-7xl text-4xl">404</CardTitle>
						<CardDescription className="text-gray-400">
							The page you’re looking for doesn’t exist.
						</CardDescription>
					</CardHeader>
					<CardFooter className="flex justify-center">
						<Button asChild>
							<Link href="/">Take me home</Link>
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}

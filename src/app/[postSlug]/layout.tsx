import { Skeleton } from "@/components/ui";
import React, { Suspense } from "react";

interface PostLayoutProps {
	children: React.ReactNode;
}

export const revalidate = 3600;

const PostLayout = (props: PostLayoutProps) => {
	const { children } = props;
	return (
		<>
			<svg
				className="pointer-events-none fixed isolate z-50 opacity-70 mix-blend-soft-light"
				width="100%"
				height="100%"
			>
				<filter id="grainynoise">
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.80"
						numOctaves="4"
						stitchTiles="stitch"
					/>
				</filter>
				<rect width="100%" height="100%" filter="url(#grainynoise)" />
			</svg>
			<div className="bg-[#fbe2e3] absolute top-[-20rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#946263]" />
			<div className="bg-[#dbd7fb] absolute top-[-15rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#676394]" />

			<Suspense
				fallback={
					<div className="container max-w-4xl">
						<div className="pt-8">
							<div className="flex flex-wrap gap-1 mb-4">
								<Skeleton className="w-full h-5 container max-w-4xl" />
								<Skeleton className="mt-4 w-full h-8 container max-w-4xl" />
								<Skeleton className="mt-12 w-full h-40 container max-w-4xl" />
							</div>
						</div>
					</div>
				}
			>
				<div className="container max-w-4xl">
					<div className="pt-8">{children}</div>
				</div>
			</Suspense>
		</>
	);
};

export default PostLayout;

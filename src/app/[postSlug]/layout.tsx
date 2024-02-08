import React from "react";

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
			<div className="container max-w-4xl">{children}</div>
		</>
	);
};

export default PostLayout;

import React from "react";

interface PostLayoutProps {
	children: React.ReactNode;
}

export const revalidate = 3600;

const PostLayout = (props: PostLayoutProps) => {
	const { children } = props;
	return (
		<div>
			<div className="bg-[#fbe2e3] absolute top-[-20rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#946263]" />
			<div className="bg-[#dbd7fb] absolute top-[-15rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#676394]" />

			<div className="container max-w-4xl">{children}</div>
		</div>
	);
};

export default PostLayout;

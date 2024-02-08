import React from "react";

interface PostLayoutProps {
	children: React.ReactNode;
}

export const revalidate = 3600;

const PostLayout = (props: PostLayoutProps) => {
	const { children } = props;
	return <div className="container max-w-4xl">{children}</div>;
};

export default PostLayout;

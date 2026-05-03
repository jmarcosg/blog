import { Home } from "@/assets/icons";
import NotionRenderer from "@/components/notion-renderer";
import { Badge, Button } from "@/components/ui";
import { getAllPosts, getPostBlocks } from "@/lib/notion";
import { formatDate } from "@/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getPost(postSlug: string) {
	const posts = await getAllPosts({ includePages: false });
	if (!posts) return { post: null, blocks: null };
	const filteredPosts = posts.filter((elem) => postSlug === elem.slug);
	if (filteredPosts.length === 0) return { post: null, blocks: null };
	const post = filteredPosts[0];
	const blocks = await getPostBlocks(post.id);

	return { post, blocks };
}

interface PostPageProps {
	params: {
		postSlug: string;
	};
}

const PostPage = async (props: PostPageProps) => {
	const { params } = props;
	const { postSlug } = params;
	const { post, blocks } = await getPost(postSlug);

	if (!post) notFound();

	return (
		<>
			<div className="flex flex-wrap gap-1 mb-4">
				<Button variant="link" className="dark:text-white" asChild>
					<Link href={"/"}>
						<Home className="h-4 w-4 me-2" /> Home
					</Link>
				</Button>
				<Button variant="link" className="dark:text-white">
					/
				</Button>
				<Button variant="link" className="dark:text-white" asChild>
					<Link href={"#"}>{post.title}</Link>
				</Button>
			</div>

			<h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
			<div className="flex items-center space-x-2">
				<p>Published in {formatDate(post.createdTime)}</p>
				<p>•</p>
				<div className="flex space-x-1">
					{post.tags?.map((tag) => (
						<Badge key={tag}>{tag}</Badge>
					))}
				</div>
			</div>
			<div className="mt-12">
				<NotionRenderer blocks={blocks} />
			</div>
		</>
	);
};

export default PostPage;

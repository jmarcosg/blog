import { PostsExplorer, getAllTags } from "@/features";
import { filterPublishedPosts, getAllPosts } from "@/lib/notion";
import { generateRssFeed } from "@/utils/rss";

async function getData() {
	await generateRssFeed();
	const posts = await getAllPosts({ includePages: false });
	const filteredPosts = filterPublishedPosts({ posts, includePages: false });

	let tags: string[] = [];
	if (posts) {
		tags = getAllTags(filteredPosts);
	}
	return { posts: filteredPosts, tags };
}

const Blog = async () => {
	const { posts, tags } = await getData();

	if (!posts) {
		return <div>No posts</div>;
	}

	return (
		<div className="pt-8">
			<div className="bg-[#fbe2e3] absolute top-[-20rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#946263]" />
			<div className="bg-[#dbd7fb] absolute top-[-15rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#676394]" />
			<h1 className="mb-4 text-center	text-4xl font-bold">
				Learn development with great articles.
			</h1>
			<PostsExplorer posts={posts} tags={tags} />
		</div>
	);
};

export default Blog;

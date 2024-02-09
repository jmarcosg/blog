import { Skeleton } from "@/components/ui";
import { PostsExplorer, getAllTags } from "@/features";
import { filterPublishedPosts, getAllPosts } from "@/lib/notion";
import { generateRssFeed } from "@/utils/rss";
import { Suspense } from "react";

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
			<h1 className="mb-4 text-center	text-4xl font-bold">Hello World!</h1>

			<Suspense
				fallback={
					<>
						<div className="container mb-10 max-w-3xl">
							<div className="relative w-full">
								<Skeleton className="absolute inset-y-0 left-3 my-auto h-6 w-6 text-gray-500" />
								<Skeleton className="rounded-2xl px-12 py-7 bg-neutral-100/40 dark:bg-slate-700 transition-all text-gray-500 dark:text-gray-100" />
							</div>
						</div>

						<div className="container mb-6 max-w-6xl">
							<h2 className="mb-5 text-xl font-bold">Search blog by topics</h2>
							<div className="flex flex-wrap gap-2">
								<Skeleton className="w-20 h-8" />
								<Skeleton className="w-20 h-8" />
								<Skeleton className="w-20 h-8" />
							</div>
						</div>

						<ul className="flex flex-col space-y-4">
							<Skeleton className="w-full h-5" />
							<Skeleton className="w-full h-8" />
							<Skeleton className="w-full h-40" />
						</ul>
					</>
				}
			>
				<PostsExplorer posts={posts} tags={tags} />
			</Suspense>
		</div>
	);
};

export default Blog;

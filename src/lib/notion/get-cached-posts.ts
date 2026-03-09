import { unstable_cache } from "next/cache"
import { getAllPosts } from "./get-all-posts"

export const NOTION_POSTS_TAG = "notion-posts"

/**
 * Cached wrapper for getAllPosts. Uses revalidateTag("notion-posts") for on-demand invalidation.
 */
export async function getCachedPosts(options: { includePages?: boolean }) {
	return unstable_cache(
		async () => getAllPosts(options),
		["notion-posts", String(options.includePages)],
		{
			tags: [NOTION_POSTS_TAG],
			revalidate: 3600,
		}
	)()
}

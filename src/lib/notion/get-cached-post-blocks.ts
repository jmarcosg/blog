import { unstable_cache } from "next/cache"
import { getPostBlocks } from "./get-post-blocks"
import { NOTION_POSTS_TAG } from "./get-cached-posts"

/**
 * Cached wrapper for getPostBlocks. Tagged for on-demand invalidation via revalidateTag.
 */
export async function getCachedPostBlocks(postId: string) {
	return unstable_cache(
		async () => getPostBlocks(postId),
		["notion-blocks", postId],
		{
			tags: [NOTION_POSTS_TAG],
			revalidate: 3600,
		}
	)()
}

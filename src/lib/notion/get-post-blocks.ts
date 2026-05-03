import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { notion } from "./client"

export type NotionBlock = BlockObjectResponse & {
	children?: NotionBlock[]
}

async function fetchAllChildren(
	blockId: string
): Promise<BlockObjectResponse[]> {
	const results: BlockObjectResponse[] = []
	let cursor: string | undefined
	do {
		const res = await notion.blocks.children.list({
			block_id: blockId,
			start_cursor: cursor,
			page_size: 100,
		})
		results.push(
			...(res.results.filter((b) => "type" in b) as BlockObjectResponse[])
		)
		cursor = res.has_more ? res.next_cursor ?? undefined : undefined
	} while (cursor)
	return results
}

async function fetchBlockTree(blockId: string): Promise<NotionBlock[]> {
	const blocks = await fetchAllChildren(blockId)
	await Promise.all(
		blocks.map(async (b) => {
			if (b.has_children) {
				;(b as NotionBlock).children = await fetchBlockTree(b.id)
			}
		})
	)
	return blocks as NotionBlock[]
}

/**
 * Fetch the full block tree (with nested children) for a Notion page.
 */
export async function getPostBlocks(
	pageId: string
): Promise<NotionBlock[] | null> {
	try {
		return await fetchBlockTree(pageId)
	} catch (err) {
		console.error("getPostBlocks failed:", err)
		return null
	}
}

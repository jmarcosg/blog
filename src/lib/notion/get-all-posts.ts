import { NOTION_PAGE_ID } from "@/config"
import type { TPosts } from "@/types"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { notion } from "./client"
import { mapPageToPost } from "./get-page-properties"

/**
 * @notionhq/client v5 introduced "data sources" — a database can contain
 * one or more data sources, and queries now go through `dataSources.query`
 * (the old `databases.query` was removed). Cache the resolved data source
 * ID to avoid an extra round-trip on every request.
 */
let cachedDataSourceId: string | null = null

async function resolveDataSourceId(databaseId: string): Promise<string> {
	if (cachedDataSourceId) return cachedDataSourceId
	const db = (await notion.databases.retrieve({
		database_id: databaseId,
	})) as { data_sources?: Array<{ id: string; name: string }> }
	const ds = db.data_sources?.[0]
	if (!ds) throw new Error(`Database ${databaseId} has no data sources`)
	cachedDataSourceId = ds.id
	return ds.id
}

/**
 * Fetch all posts from the Notion database via the official API.
 * Paginates through all results and maps them to TPost.
 */
export async function getAllPosts({
	includePages = false,
}: {
	includePages?: boolean
} = {}): Promise<TPosts | null> {
	if (!NOTION_PAGE_ID) {
		console.error("NOTION_PAGE_ID is not set")
		return null
	}

	try {
		const dataSourceId = await resolveDataSourceId(NOTION_PAGE_ID)

		const results: PageObjectResponse[] = []
		let cursor: string | undefined
		do {
			const res = await notion.dataSources.query({
				data_source_id: dataSourceId,
				start_cursor: cursor,
				page_size: 100,
			})
			results.push(
				...(res.results.filter(
					(r) => "properties" in r
				) as PageObjectResponse[])
			)
			cursor = res.has_more ? res.next_cursor ?? undefined : undefined
		} while (cursor)

		const posts = results
			.map(mapPageToPost)
			.filter((p): p is NonNullable<typeof p> => p !== null)
			.sort(
				(a, b) =>
					new Date(b.date.start_date).getTime() -
					new Date(a.date.start_date).getTime()
			)

		// includePages is honored downstream by filterPublishedPosts
		void includePages
		return posts
	} catch (err) {
		console.error("getAllPosts failed:", err)
		return null
	}
}

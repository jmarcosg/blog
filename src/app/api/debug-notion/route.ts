import { NextRequest, NextResponse } from "next/server"
import { NOTION_PAGE_ID, NOTION_TOKEN } from "@/config"
import { idToUuid } from "notion-utils"
import { getAllPageIds } from "@/lib/notion/get-all-page-ids"
import { api } from "@/lib/notion/notion-api"
import { filterPublishedPosts } from "@/lib/notion/filter-published-posts"

/**
 * Debug endpoint to diagnose Notion data flow.
 * Call: GET /api/debug-notion?secret=YOUR_REVALIDATE_SECRET
 * Returns sanitized info about what Notion returns (no sensitive data).
 */
export async function GET(request: NextRequest) {
	const secret = request.nextUrl.searchParams.get("secret")
	const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET

	if (!REVALIDATE_SECRET || secret !== REVALIDATE_SECRET) {
		return NextResponse.json({ error: "Invalid or missing secret" }, { status: 401 })
	}

	if (!NOTION_PAGE_ID || !NOTION_TOKEN) {
		return NextResponse.json({
			error: "Missing NOTION_PAGE_ID or NOTION_TOKEN",
			hasPageId: !!NOTION_PAGE_ID,
			hasToken: !!NOTION_TOKEN,
		})
	}

	try {
		const id = idToUuid(NOTION_PAGE_ID)
		const response = await api.getPage(id)
		const block = response.block
		const rawMetadata = block?.[id]?.value
		const pageType = rawMetadata?.type ?? "unknown"

		const isDatabase =
			pageType === "collection_view_page" || pageType === "collection_view"

		if (!isDatabase) {
			return NextResponse.json({
				success: false,
				pageType,
				message:
					"This page is not a Notion database. The blog expects a full-page Table, Board, or List database. Each row = one post.",
				expected:
					"Create a new page → type /table or /board or /list → add columns: Title, Slug, Status, Type. Each row is a post.",
			})
		}

		const collection = Object.values(response.collection || {})[0]?.value
		const schema = collection?.schema ?? {}
		const schemaPropertyNames = Object.entries(schema).map(
			([key, val]) => (val as { name?: string })?.name ?? key
		)

		const collectionQuery = response.collection_query ?? {}
		const pageIds = getAllPageIds(collectionQuery as Parameters<typeof getAllPageIds>[0])

		// Fetch properties for first few pages to inspect
		const { getPageProperties } = await import("@/lib/notion/get-page-properties")
		const samplePosts: Record<string, unknown>[] = []
		for (let i = 0; i < Math.min(5, pageIds.length); i++) {
			const pid = pageIds[i]
			const props = await getPageProperties(pid, block, schema)
			samplePosts.push({
				title: props?.title,
				slug: props?.slug,
				status: props?.status,
				type: props?.type,
			})
		}

		// Get full posts and run filter
		const { getAllPosts } = await import("@/lib/notion/get-all-posts")
		const allPosts = await getAllPosts({ includePages: false })
		const filtered = filterPublishedPosts({
			posts: allPosts,
			includePages: false,
		})

		return NextResponse.json({
			success: true,
			pageType,
			pageIdsCount: pageIds.length,
			schemaPropertyNames,
			sampleRawPosts: samplePosts,
			filteredCount: filtered.length,
			filterRule:
				'Posts must have: type=["Post"], status=["Published"], and non-empty title + slug',
		})
	} catch (err) {
		return NextResponse.json(
			{
				error: err instanceof Error ? err.message : "Unknown error",
				stack: process.env.NODE_ENV === "development" && err instanceof Error ? err.stack : undefined,
			},
			{ status: 500 }
		)
	}
}

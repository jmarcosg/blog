import type {
	PageObjectResponse,
	RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints"
import type { TPost } from "@/types"

const plainText = (rts: RichTextItemResponse[] | undefined): string =>
	(rts ?? []).map((t) => t.plain_text).join("")

/**
 * Property keys are matched case-insensitively against the Notion DB schema
 * so columns named "Title" / "Slug" / "Tags" still work.
 */
function findProp(
	props: Record<string, any>,
	candidates: string[]
): any | undefined {
	const lower = candidates.map((c) => c.toLowerCase())
	for (const [k, v] of Object.entries(props)) {
		if (lower.includes(k.toLowerCase())) return v
	}
	return undefined
}

/**
 * Map a Notion PageObjectResponse (database row) to our TPost shape.
 * Database schema: title, slug, date, summary, tags, status, type.
 */
export function mapPageToPost(page: PageObjectResponse): TPost | null {
	const props = page.properties as Record<string, any>

	const titleProp = findProp(props, ["title", "name"])
	const title = plainText(titleProp?.title)

	const slug = plainText(findProp(props, ["slug"])?.rich_text)
	const summary = plainText(findProp(props, ["summary"])?.rich_text)

	const dateRaw = findProp(props, ["date"])?.date
	const date = dateRaw?.start
		? { start_date: dateRaw.start as string }
		: { start_date: page.created_time }

	const tagsRaw = findProp(props, ["tags"])?.multi_select ?? []
	const tags: string[] = tagsRaw.map((t: { name: string }) => t.name)

	// status / type may be `select` or `status` types. Wrap singletons in
	// arrays for compatibility with downstream filter / display code.
	const statusProp = findProp(props, ["status"])
	const statusName =
		statusProp?.select?.name ?? statusProp?.status?.name ?? null
	const status = statusName ? [statusName] : []

	const typeProp = findProp(props, ["type"])
	const typeName = typeProp?.select?.name ?? null
	const type = typeName ? [typeName] : []

	let thumbnail: string | undefined
	const cover = page.cover as any
	if (cover?.type === "external") thumbnail = cover.external?.url
	else if (cover?.type === "file") thumbnail = cover.file?.url

	if (!title || !slug) return null

	return {
		id: page.id,
		title,
		slug,
		date,
		summary,
		tags,
		status: status as TPost["status"],
		type: type as TPost["type"],
		createdTime: page.created_time,
		fullWidth: false,
		thumbnail,
	}
}

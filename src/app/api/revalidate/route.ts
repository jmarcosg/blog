import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { NOTION_POSTS_TAG } from "@/lib/notion/get-cached-posts"

export async function POST(request: NextRequest) {
	const secret = request.nextUrl.searchParams.get("secret")
	const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET

	if (!REVALIDATE_SECRET) {
		return NextResponse.json(
			{ error: "REVALIDATE_SECRET not configured" },
			{ status: 500 }
		)
	}

	if (secret !== REVALIDATE_SECRET) {
		return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
	}

	try {
		revalidateTag(NOTION_POSTS_TAG)
		revalidatePath("/")
		revalidatePath("/rss.xml")
		revalidatePath("/atom.xml")
		revalidatePath("/rss.json")

		return NextResponse.json({
			revalidated: true,
			now: Date.now(),
		})
	} catch (err) {
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : "Revalidation failed" },
			{ status: 500 }
		)
	}
}

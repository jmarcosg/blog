import { getCachedPosts } from "@/lib/notion"
import { filterPublishedPosts } from "@/lib/notion"
import { SITE_URL, siteConfig } from "@/config"
import { parseISO } from "date-fns"
import { Feed } from "feed"

export const revalidate = 3600

export async function GET() {
	const posts = await getCachedPosts({ includePages: false })

	if (!SITE_URL) {
		return new Response("Missing SITE_URL", { status: 500 })
	}

	if (!posts) {
		return new Response("Failed to fetch posts", { status: 500 })
	}

	const filteredPosts = filterPublishedPosts({
		posts,
		includePages: false,
	})

	const feed = new Feed({
		title: siteConfig.name,
		description: siteConfig.description,
		id: SITE_URL,
		link: SITE_URL,
		favicon: `${SITE_URL}/favicon.svg`,
		copyright: `All rights reserved ${new Date().getFullYear()}, ${siteConfig.name}`,
		feedLinks: {
			rss2: `${SITE_URL}/rss.xml`,
			atom: `${SITE_URL}/atom.xml`,
			json: `${SITE_URL}/rss.json`,
		},
	})

	filteredPosts.forEach((post) => {
		feed.addItem({
			title: post.title,
			id: `${SITE_URL}/${post.slug}`,
			link: `${SITE_URL}/${post.slug}`,
			description: post.summary,
			date: parseISO(post.createdTime),
		})
	})

	return new Response(feed.json1(), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
		},
	})
}

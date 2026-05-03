import { Client } from "@notionhq/client"

// Accept either env var name to avoid confusion with the older project setup.
const auth = process.env.NOTION_TOKEN ?? process.env.NOTION_API_TOKEN

if (!auth) {
	console.warn(
		"Neither NOTION_TOKEN nor NOTION_API_TOKEN is set — Notion fetches will fail."
	)
}

export const notion = new Client({ auth })

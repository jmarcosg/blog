import Link from "next/link"
import type { FC, ReactNode } from "react"
import type { NotionBlock } from "@/lib/notion/get-post-blocks"
import { cn } from "@/utils"

// ---------- Rich text ----------

type RichText = {
	plain_text: string
	href: string | null
	annotations: {
		bold: boolean
		italic: boolean
		strikethrough: boolean
		underline: boolean
		code: boolean
		color: string
	}
}

const colorClass = (color: string): string => {
	if (!color || color === "default") return ""
	if (color.endsWith("_background")) return `notion-bg-${color.replace("_background", "")}`
	return `notion-color-${color}`
}

const RichTextSpan: FC<{ rt: RichText }> = ({ rt }) => {
	const { annotations, plain_text, href } = rt
	let node: ReactNode = plain_text
	if (annotations.code)
		node = (
			<code className="rounded bg-neutral-200/70 px-1.5 py-0.5 text-[0.9em] dark:bg-neutral-800">
				{node}
			</code>
		)
	if (annotations.bold) node = <strong>{node}</strong>
	if (annotations.italic) node = <em>{node}</em>
	if (annotations.strikethrough) node = <s>{node}</s>
	if (annotations.underline) node = <u>{node}</u>
	const classes = cn(colorClass(annotations.color))
	if (href) {
		const external = href.startsWith("http")
		return (
			<a
				href={href}
				target={external ? "_blank" : undefined}
				rel={external ? "noreferrer noopener" : undefined}
				className={cn("underline underline-offset-2", classes)}
			>
				{node}
			</a>
		)
	}
	return classes ? <span className={classes}>{node}</span> : <>{node}</>
}

const RichTextRun: FC<{ rich: RichText[] | undefined }> = ({ rich }) => (
	<>{(rich ?? []).map((rt, i) => <RichTextSpan key={i} rt={rt} />)}</>
)

// ---------- Block renderers ----------

type BlockProps = { block: NotionBlock }

const ChildBlocks: FC<{ blocks?: NotionBlock[] }> = ({ blocks }) =>
	blocks && blocks.length ? <NotionBlocks blocks={blocks} /> : null

const Paragraph: FC<BlockProps> = ({ block }) => {
	const rich = (block as any).paragraph?.rich_text as RichText[]
	if (!rich || rich.length === 0) return <div className="h-4" />
	return (
		<p className="my-3 leading-7">
			<RichTextRun rich={rich} />
			<ChildBlocks blocks={block.children} />
		</p>
	)
}

const Heading: FC<{ block: NotionBlock; level: 1 | 2 | 3 }> = ({ block, level }) => {
	const rich = (block as any)[`heading_${level}`].rich_text as RichText[]
	const className =
		level === 1 ? "mt-8 mb-4 text-3xl font-bold" :
		level === 2 ? "mt-6 mb-3 text-2xl font-bold" :
		"mt-4 mb-2 text-xl font-semibold"
	const Tag = `h${level}` as "h1" | "h2" | "h3"
	return <Tag className={className}><RichTextRun rich={rich} /></Tag>
}

const Quote: FC<BlockProps> = ({ block }) => (
	<blockquote className="my-4 border-l-4 border-neutral-300 pl-4 italic dark:border-neutral-600">
		<RichTextRun rich={(block as any).quote.rich_text} />
		<ChildBlocks blocks={block.children} />
	</blockquote>
)

const Callout: FC<BlockProps> = ({ block }) => {
	const b = block as any
	return (
		<div className="my-4 flex gap-3 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800">
			{b.callout.icon?.type === "emoji" && (
				<span className="text-xl">{b.callout.icon.emoji}</span>
			)}
			<div className="flex-1">
				<RichTextRun rich={b.callout.rich_text} />
				<ChildBlocks blocks={block.children} />
			</div>
		</div>
	)
}

const Code: FC<BlockProps> = ({ block }) => {
	const b = block as any
	const text = (b.code.rich_text as RichText[]).map((rt) => rt.plain_text).join("")
	return (
		<pre className="my-4 overflow-x-auto rounded-lg bg-neutral-900 p-4 text-sm text-neutral-100">
			<code>{text}</code>
		</pre>
	)
}

const Divider: FC = () => (
	<hr className="my-6 border-neutral-200 dark:border-neutral-700" />
)

const ImageBlock: FC<BlockProps> = ({ block }) => {
	const b = block as any
	const src: string | undefined = b.image?.type === "external"
		? b.image.external.url
		: b.image?.file?.url
	const caption = (b.image?.caption as RichText[]) ?? []
	if (!src) return null
	return (
		<figure className="my-6">
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={src}
				alt={caption.map((c) => c.plain_text).join("") || ""}
				className="mx-auto rounded-lg"
			/>
			{caption.length > 0 && (
				<figcaption className="mt-2 text-center text-sm text-neutral-500">
					<RichTextRun rich={caption} />
				</figcaption>
			)}
		</figure>
	)
}

const ToDo: FC<BlockProps> = ({ block }) => {
	const b = block as any
	return (
		<div className="my-1 flex items-start gap-2">
			<input type="checkbox" checked={!!b.to_do.checked} readOnly className="mt-1" />
			<div className="flex-1">
				<RichTextRun rich={b.to_do.rich_text} />
				<ChildBlocks blocks={block.children} />
			</div>
		</div>
	)
}

const Toggle: FC<BlockProps> = ({ block }) => {
	const b = block as any
	return (
		<details className="my-2">
			<summary className="cursor-pointer">
				<RichTextRun rich={b.toggle.rich_text} />
			</summary>
			<div className="pl-6 pt-2">
				<ChildBlocks blocks={block.children} />
			</div>
		</details>
	)
}

const Bookmark: FC<BlockProps> = ({ block }) => {
	const url: string = (block as any).bookmark.url
	return (
		<Link
			href={url}
			target="_blank"
			rel="noreferrer noopener"
			className="my-3 block rounded-lg border border-neutral-200 p-3 text-sm text-blue-600 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
		>
			{url}
		</Link>
	)
}

const Embed: FC<BlockProps> = ({ block }) => {
	const url: string | undefined = (block as any).embed?.url
	if (!url) return null
	return (
		<Link
			href={url}
			target="_blank"
			rel="noreferrer noopener"
			className="my-3 block rounded-lg border border-neutral-200 p-3 text-sm text-blue-600 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
		>
			{url}
		</Link>
	)
}

// ---------- List grouping ----------

const BulletedList: FC<{ items: NotionBlock[] }> = ({ items }) => (
	<ul className="my-3 list-disc space-y-1 pl-6">
		{items.map((item) => (
			<li key={item.id}>
				<RichTextRun rich={(item as any).bulleted_list_item.rich_text} />
				<ChildBlocks blocks={item.children} />
			</li>
		))}
	</ul>
)

const NumberedList: FC<{ items: NotionBlock[] }> = ({ items }) => (
	<ol className="my-3 list-decimal space-y-1 pl-6">
		{items.map((item) => (
			<li key={item.id}>
				<RichTextRun rich={(item as any).numbered_list_item.rich_text} />
				<ChildBlocks blocks={item.children} />
			</li>
		))}
	</ol>
)

// ---------- Dispatcher ----------

const renderBlock = (block: NotionBlock): ReactNode => {
	switch (block.type) {
		case "paragraph":           return <Paragraph block={block} />
		case "heading_1":           return <Heading block={block} level={1} />
		case "heading_2":           return <Heading block={block} level={2} />
		case "heading_3":           return <Heading block={block} level={3} />
		case "quote":               return <Quote block={block} />
		case "callout":             return <Callout block={block} />
		case "code":                return <Code block={block} />
		case "divider":             return <Divider />
		case "image":               return <ImageBlock block={block} />
		case "to_do":               return <ToDo block={block} />
		case "toggle":              return <Toggle block={block} />
		case "bookmark":            return <Bookmark block={block} />
		case "embed":               return <Embed block={block} />
		default:
			return (
				<div className="my-2 rounded border border-dashed border-neutral-300 p-2 text-xs text-neutral-500 dark:border-neutral-600">
					Unsupported block type: {block.type}
				</div>
			)
	}
}

const NotionBlocks: FC<{ blocks: NotionBlock[] }> = ({ blocks }) => {
	// Group consecutive list items into a single <ul>/<ol>.
	const out: ReactNode[] = []
	let i = 0
	while (i < blocks.length) {
		const b = blocks[i]
		if (b.type === "bulleted_list_item") {
			const group: NotionBlock[] = []
			while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
				group.push(blocks[i++])
			}
			out.push(<BulletedList key={group[0].id} items={group} />)
			continue
		}
		if (b.type === "numbered_list_item") {
			const group: NotionBlock[] = []
			while (i < blocks.length && blocks[i].type === "numbered_list_item") {
				group.push(blocks[i++])
			}
			out.push(<NumberedList key={group[0].id} items={group} />)
			continue
		}
		out.push(<div key={b.id}>{renderBlock(b)}</div>)
		i++
	}
	return <>{out}</>
}

// ---------- Public component ----------

type Props = { blocks: NotionBlock[] | null }

const NotionRenderer: FC<Props> = ({ blocks }) => {
	if (!blocks) return null
	return <NotionBlocks blocks={blocks} />
}

export default NotionRenderer

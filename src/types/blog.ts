import type { NotionBlock } from "@/lib/notion/get-post-blocks"

export type TPostStatus = "Published" | "Draft" | "Revise" | "Idea"
export type TPostType = "Post" | "Paper" | "Page"

export type TPost = {
  id: string
  date: { start_date: string }
  type: TPostType[]
  slug: string
  tags?: string[]
  category?: string[]
  summary?: string
  author?: {
    id: string
    name: string
    profile_photo?: string
  }[]
  title: string
  status: TPostStatus[]
  createdTime: string
  fullWidth: boolean
  thumbnail?: string
}

export type PostDetail = TPost & {
  blocks: NotionBlock[]
}

export type TPosts = TPost[]

export type TTags = {
  [tagName: string]: number
}
export type TCategories = {
  [category: string]: number
}

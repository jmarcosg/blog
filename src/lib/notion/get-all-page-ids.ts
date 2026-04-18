import { idToUuid } from "notion-utils"

/**
 * Recursively collect all blockIds from reducer results.
 * Handles list/table (collection_group_results), board (board_columns), and grouped views (table_groups).
 */
function collectBlockIds(obj: unknown, ids: Set<string>): void {
  if (!obj || typeof obj !== "object") return
  const o = obj as Record<string, unknown>
  if (Array.isArray(o.blockIds)) {
    o.blockIds.forEach((id: string) => ids.add(id))
  }
  Object.values(o).forEach((val) => {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      collectBlockIds(val, ids)
    }
  })
}

export function getAllPageIds(collectionQuery: Record<string, Record<string, unknown>>, viewId?: string): string[] {
  const views = Object.values(collectionQuery)[0] as Record<string, unknown> | undefined
  if (!views) return []

  if (viewId) {
    const vId = idToUuid(viewId)
    const view = views[vId] as { blockIds?: string[] } | undefined
    return view?.blockIds ?? []
  }

  const pageSet = new Set<string>()
  Object.values(views).forEach((view) => {
    if (view && typeof view === "object") {
      collectBlockIds(view, pageSet)
    }
  })
  return [...pageSet]
}

# Codebase Audit - Prioritized Remediation

**Date:** 2026-03-06  
**Skills applied:** systematic-debugging, next-best-practices, vercel-react-best-practices

## P1 (Critical) - Implemented

- [x] **Notion freshness:** Moved RSS out of page render path; added on-demand revalidation API and cache tags
- [x] **Deprecated config:** Removed `future.webpack5` from next.config.mjs
- [x] **Build resilience:** generateStaticParams returns [] on Notion failure so build succeeds in CI
- [x] **Dynamic new posts:** `dynamicParams: true` allows new slugs to render on-demand without rebuild

## P2 (High) - Implemented

- [x] **Cache strategy:** `unstable_cache` with `notion-posts` tag for getAllPosts and getPostBlocks
- [x] **Revalidation flow:** POST /api/revalidate with secret; revalidateTag + revalidatePath
- [x] **Phase 1 upgrades:** Next 14.2.35, axios 1.7.9, eslint-config-next aligned

## P3 (Medium) - Deferred

- [ ] **Browserslist DB:** Run `npm exec update-browserslist-db@latest` (may need npm, not bun)
- [ ] **url.parse deprecation:** Transitive in notion/axios deps; address in Phase 2 major upgrade
- [ ] **sharp package:** Optional; add `npm i sharp` for production image optimization
- [ ] **TypeScript strict:** Remove `ignoreBuildErrors` once types are clean

## Data Flow (Notion → Render)

1. `getCachedPosts()` → `unstable_cache(getAllPosts)` tagged `notion-posts`
2. `getCachedPostBlocks(id)` → `unstable_cache(getPostBlocks)` tagged `notion-posts`
3. POST /api/revalidate → `revalidateTag("notion-posts")` → invalidates both
4. Next request to /, /[slug], /rss.xml fetches fresh data from Notion

# Dependency Security + Notion Freshness Plan

## Summary
- Execute a two-phase upgrade: `security-first` (low risk) then `major modernization` (controlled risk).
- Fix the Notion publish issue by removing build-time/static bottlenecks and introducing on-demand cache invalidation.
- Run a full codebase audit using your added skills (`systematic-debugging`, `next-best-practices`, `vercel-react-best-practices`) and apply prioritized fixes.
- Keep Vercel deployment and add GitHub Actions-based revalidation triggers (scheduled + manual).

## Implementation Changes
1. **Baseline and dependency/security inventory**
- Pin toolchain baseline (Bun + Node) and capture current failures (`next build`, runtime warnings, deprecated config).
- Generate vulnerability report with a reproducible command path (use lockfile-driven audit + SBOM/OSV scan if needed).
- Record current blockers already observed: invalid `next.config.mjs` key `future`, outdated Browserslist DB, deprecated `url.parse` dependency path.

2. **Phase 1 upgrades (security-first, minimal behavior change)**
- Upgrade direct dependencies to latest patch/minor versions first, focusing on security-exposed packages (`next`, `axios`, parser/network transitive deps).
- Remove deprecated Next config usage (`future.webpack5`) and keep build-compatible config only.
- Keep React major unchanged in this phase unless required by patched Next target.
- Validate with full build + smoke routes before moving to majors.

3. **Phase 2 upgrades (major modernization)**
- Upgrade Next/React/tooling majors in one controlled batch after phase 1 is stable.
- Align App Router patterns to current best practices:
  - eliminate static-generation assumptions that block fresh content,
  - review caching strategy for server data access,
  - ensure dynamic route behavior for newly created posts.
- Re-run full regression checks and compare page rendering/perf.

4. **Notion freshness fix (root-cause driven)**
- Root causes to address:
  - `generateStaticParams` for post slugs only runs at build, so new slugs are not proactively included.
  - RSS generation currently runs during page data loading, creating side effects during render/build.
  - current revalidation model is time-based and not publish-event-based.
- Changes:
  - Move RSS generation out of request/render path into explicit background trigger flow.
  - Add secure route handler API for on-demand invalidation (e.g. `POST /api/revalidate` with secret).
  - Tag/cache Notion reads and invalidate by tag/path when publish events happen.
  - Update post route strategy so new Notion entries can render without full rebuild.
- GitHub Actions integration:
  - scheduled workflow (every 5 minutes) calling revalidation endpoint,
  - manual workflow dispatch for immediate refresh button.
  - use repository secret for revalidation token.

5. **Full skill-driven codebase scan and fixes**
- `systematic-debugging`: validate Notion data flow end-to-end (fetch -> filtering -> route rendering -> cache invalidation) with evidence logs.
- `next-best-practices`: audit App Router config, route handlers, caching/revalidate APIs, server/client boundaries.
- `vercel-react-best-practices`: audit waterfalls, unnecessary client bundle cost, and rendering inefficiencies.
- Deliver prioritized remediation list (P1/P2/P3) and implement P1/P2 items in same upgrade stream.

## Public Interfaces / Config Additions
- New API endpoint: `POST /api/revalidate` (secret-authenticated).
- New env vars:
  - `REVALIDATE_SECRET`
  - `REVALIDATE_ENDPOINT` (for GitHub Actions caller)
- New CI workflow files for scheduled/manual revalidation.
- RSS generation trigger contract changes from implicit page-render side effect to explicit job/endpoint invocation.

## Test Plan
- Build/quality gates:
  - production build succeeds without config warnings that indicate deprecated behavior,
  - lint/typecheck run without introducing new ignores.
- Functional checks:
  - creating/publishing a new Notion post appears on home and post page without rebuild,
  - unknown slug behavior is correct (no stale 404 after publish + revalidation),
  - RSS files update only via explicit trigger path.
- Security checks:
  - vulnerability scan delta before/after each phase,
  - verify no high/critical vulns remain in direct deps after phase 1,
  - verify major-phase regressions with smoke + route checks.

## Implementation Summary (2026-03-06)

**Phase 1 + Notion Freshness completed.**

1. **Baseline:** `.nvmrc` (Node 20), `package.json` engines, `docs/baseline-inventory.md`
2. **Config:** Removed deprecated `future.webpack5` from `next.config.mjs`
3. **Phase 1 upgrades:** Next 14.2.35, axios 1.7.9, eslint-config-next 14.2.35
4. **Notion freshness:** `getCachedPosts` / `getCachedPostBlocks` with `unstable_cache` + `notion-posts` tag
5. **Revalidate API:** `POST /api/revalidate?secret=<REVALIDATE_SECRET>`
6. **RSS:** Moved to route handlers `app/rss.xml`, `app/atom.xml`, `app/rss.json` (dynamic, no page-render side effects)
7. **GitHub Actions:** `revalidate-scheduled.yml` (every 5 min) and `revalidate-manual.yml` (workflow_dispatch)
8. **Setup:** Add `REVALIDATE_SECRET` to Vercel env; add `REVALIDATE_SECRET` (secret) and `REVALIDATE_ENDPOINT` (var) to GitHub repo

**Phase 2 (major Next/React upgrade) deferred** until Phase 1 is validated in production.

## Assumptions and Defaults
- Hosting is **Vercel**.
- Upgrade strategy is **two-phase** (safe first, majors second).
- Freshness target is **instant/near-instant**, implemented via on-demand revalidation + GitHub Actions schedule/manual trigger.
- Scope includes a **full app audit** using your added skills, not only Notion files.
- Existing modified RSS files are treated as part of the current side-effect symptom and are explicitly handled by the new trigger model.

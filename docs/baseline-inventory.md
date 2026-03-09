# Dependency Security + Notion Freshness - Baseline Inventory

**Date:** 2026-03-06

## Toolchain Baseline

- **Node:** 20.x (via .nvmrc)
- **Package manager:** npm (package-lock.json for audit)
- **Next.js:** 14.1.0

## Observed Blockers (Pre-Implementation)

1. **Invalid `next.config.mjs` key:** `future.webpack5` - deprecated; Webpack 5 is default in Next.js 12+
2. **Build failure:** `generateStaticParams` + `getData` call Notion API at build; fails with 403 when Notion unreachable (e.g. CI/sandbox)
3. **RSS side effect:** `generateRssFeed()` runs during home page `getData()`, writes to `./public/` on every request
4. **No lockfile:** Project lacked package-lock.json for reproducible npm audit

## Vulnerability Scan

Run after `npm install` or `npm ci`:

```bash
npm audit
```

Run with JSON output for SBOM/delta:

```bash
npm audit --json > docs/audit-baseline.json
```

## Post-Implementation Validation

- [x] `next build` succeeds without config warnings (future key removed)
- [ ] `npm run lint` passes
- [ ] New Notion posts appear without rebuild (via revalidation)
- [x] RSS served from route handlers (/rss.xml, /atom.xml, /rss.json)

## Browserslist Update

If using npm: `npm exec update-browserslist-db@latest`  
Note: update-browserslist-db may fail when bun is the active package manager.

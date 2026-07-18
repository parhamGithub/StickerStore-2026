<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# sticker-store

## Setup
- **Package manager**: `bun` (1.3.4). Only `bun.lock` exists — do not use npm/yarn/pnpm.
- **Dev**: `bun dev` — starts Next.js dev server at `http://localhost:3000`.
- **Build**: `bun run build` / **Lint**: `bun run lint` / no formatter or test framework configured.

## Stack quirks
- **Next.js 16.2.10 (App Router)** — see local docs above.
- **Tailwind CSS v4** — significant breaking changes from v3. Configuration is CSS-based (no `tailwind.config.*`). Use `@import "tailwindcss"` in CSS, not `@tailwind` directives.
- **ESLint 9 flat config** — `eslint.config.mjs`, not `.eslintrc.*`.
- **TypeScript strict** — `@/*` import alias maps to `./src/*`.

## Structure
- `src/app/` — App Router entrypoint (layout, page, globals)
- No test suite, no CI, no codegen — vanilla scaffold.

# Prospect Desktop (Windows)

The desktop app is the existing web app wrapped in [Tauri](https://tauri.app) —
Tauri loads the same Vite build (`dist/`) into a native window via WebView2,
so nothing in `src/` changes to support it. Styling, layout, and behavior are
identical to the web app; see `src-tauri/` for the wrapper config.

**Scope: Windows only.** No Mac or Linux build targets are configured.

## Prerequisites

- Node (already required for the web app)
- Rust toolchain — https://www.rust-lang.org/tools/install
- On Windows, the [Tauri prerequisites](https://tauri.app/start/prerequisites/) (WebView2, MSVC build tools) — most Windows 10/11 machines already have WebView2 installed

## Local development

```bash
npm install
npm run desktop:dev
```

This runs the Vite dev server and opens it in a Tauri window (hot reload works the same as `npm run dev`).

## Local build

```bash
npx @tauri-apps/cli icon public/logo3.png   # regenerate icons (icon.ico isn't committed)
npm run desktop:build
```

Produces an NSIS installer at `src-tauri/target/release/bundle/nsis/*.exe`.

## CI build

`.github/workflows/desktop-windows.yml` builds the Windows installer on:
- pushing a tag matching `desktop-v*` (e.g. `desktop-v0.1.0`)
- manual trigger (Actions tab → "Desktop (Windows)" → Run workflow)

**Required repo secrets** (Settings → Secrets and variables → Actions):
- `VITE_SITE_URL` — the production site URL (e.g. `https://prospect.co.za`), used so links generated inside the desktop app (like the quiz share link) point at the real site instead of a local Tauri address
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Same values as `.env.local` (`VITE_SITE_URL` is blank there by default — fill in the real domain locally too if you want to test the share-link behavior). The built `.exe` is uploaded as a workflow artifact named `prospect-windows-installer`.

## External links (past papers, resources, attachments)

All `window.open(url, '_blank')` calls across the portal (teacher/student
resources, past papers, memos, calendar attachments) go through
`src/lib/openExternal.ts` instead. On the web build it's a plain
`window.open` — unchanged. Inside Tauri it detects `window.__TAURI__` at
runtime and hands off to `@tauri-apps/plugin-shell`'s `open()`, which opens
the URL in the OS default browser rather than relying on WebView2's
new-tab behavior. The Rust side is registered in `src-tauri/src/lib.rs`
(`tauri_plugin_shell::init()`) with permission granted via
`src-tauri/capabilities/default.json` (`shell:allow-open`). Not yet verified
against a real build — the logic is in place but untested end-to-end.

## Known items still open

- Builds are **unsigned** — Windows SmartScreen will warn users on first run (expected for now; code-signing is a future phase, not yet planned).
- Auto-updates are not wired up yet (Tauri's updater, checking a version feed) — planned for later, not part of this scaffold.
- No code-signing certificate yet, so SmartScreen bypass instructions are what's shown on the Downloads page in the meantime.
